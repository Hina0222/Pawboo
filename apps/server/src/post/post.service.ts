import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PetRepository } from '../pet/pet.repository';
import { AwsService, IMAGE_PRESET } from '../aws/aws.service';
import type {
  PostResponse,
  PostItem,
  PostDetail,
  PostListResponse,
  PostQuery,
} from '@pawboo/schemas/post';

type PostListRow = {
  id: number;
  type: 'general' | 'mission';
  missionId: number | null;
  imageUrls: string[];
  createdAt: Date;
};

type PostDetailRow = PostListRow & {
  petId: number;
  petName: string;
  petImageUrl: string | null;
};

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly petRepository: PetRepository,
    private readonly awsService: AwsService,
  ) {}

  async createPost(
    userId: number,
    imageBuffers: Buffer[],
    missionId?: number,
  ): Promise<PostResponse> {
    const representativePet =
      await this.petRepository.findRepresentativeByUserId(userId);
    if (!representativePet) {
      throw new BadRequestException('대표 펫이 없습니다.');
    }

    const imageUrls = await Promise.all(
      imageBuffers.map((buf) =>
        this.awsService.uploadImage(buf, IMAGE_PRESET.POST),
      ),
    );

    try {
      return await this.postRepository.createPost({
        petId: representativePet.id,
        type: missionId ? 'mission' : 'general',
        missionId: missionId ?? null,
        imageUrls,
      });
    } catch (err) {
      await Promise.all(
        imageUrls.map((url) => this.awsService.deleteImage(url)),
      );
      throw err;
    }
  }

  async findPosts(query: PostQuery): Promise<PostListResponse> {
    return this.toPostListResponse(await this.postRepository.findPosts(query));
  }

  async findMyPosts(
    userId: number,
    query: PostQuery,
  ): Promise<PostListResponse> {
    const representativePet =
      await this.petRepository.findRepresentativeByUserId(userId);
    if (!representativePet) {
      return { data: [], hasNext: false, cursor: null };
    }
    return this.toPostListResponse(
      await this.postRepository.findPosts(query, representativePet.id),
    );
  }

  async findPetPosts(
    petId: number,
    query: PostQuery,
  ): Promise<PostListResponse> {
    return this.toPostListResponse(
      await this.postRepository.findPosts(query, petId),
    );
  }

  private toPostItem(row: PostListRow): PostItem {
    return {
      id: row.id,
      type: row.type,
      missionId: row.missionId ?? null,
      imageUrls: row.imageUrls,
      createdAt: row.createdAt.toISOString(),
    };
  }

  private toPostListResponse(result: {
    rows: PostListRow[];
    hasNext: boolean;
    cursor: number | null;
  }): PostListResponse {
    return {
      data: result.rows.map((r) => this.toPostItem(r)),
      hasNext: result.hasNext,
      cursor: result.cursor,
    };
  }

  private toPostDetail(
    row: PostDetailRow,
    likeCount: number,
    isLiked: boolean,
  ): PostDetail {
    return {
      id: row.id,
      type: row.type,
      missionId: row.missionId ?? null,
      imageUrls: row.imageUrls,
      createdAt: row.createdAt.toISOString(),
      pet: {
        id: row.petId,
        name: row.petName,
        imageUrl: row.petImageUrl ?? null,
      },
      likeCount,
      isLiked,
    };
  }

  async findOnePost(userId: number, postId: number): Promise<PostDetail> {
    const row = await this.postRepository.findOnePost(postId);
    if (!row) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }

    const [likedPosts, likeCountMap] = await Promise.all([
      this.postRepository.getLikedPosts(userId, [postId]),
      this.postRepository.getLikeCounts([postId]),
    ]);

    return this.toPostDetail(
      row,
      likeCountMap.get(postId) ?? 0,
      likedPosts.has(postId),
    );
  }

  async findLikedPosts(
    userId: number,
    query: PostQuery,
  ): Promise<PostListResponse> {
    return this.toPostListResponse(
      await this.postRepository.findLikedPosts(userId, query.cursor),
    );
  }

  async deletePost(userId: number, postId: number): Promise<void> {
    const post = await this.postRepository.findPostWithOwner(postId, userId);
    if (!post) {
      throw new NotFoundException(
        '게시물을 찾을 수 없거나 삭제 권한이 없습니다.',
      );
    }

    await this.postRepository.deletePost(postId);
    await Promise.all(
      post.imageUrls.map((url) => this.awsService.deleteImage(url)),
    );
  }
}
