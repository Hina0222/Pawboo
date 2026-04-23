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
  PostListResponse,
  PostQuery,
} from '@pawboo/schemas/post';

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

  async findPosts(userId: number, query: PostQuery): Promise<PostListResponse> {
    return this.toPostListResponse(
      await this.postRepository.findPosts(userId, query),
    );
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
      await this.postRepository.findPosts(userId, query, representativePet.id),
    );
  }

  async findPetPosts(
    viewerId: number,
    petId: number,
    query: PostQuery,
  ): Promise<PostListResponse> {
    return this.toPostListResponse(
      await this.postRepository.findPosts(viewerId, query, petId),
    );
  }

  private toPostItem(
    row: NonNullable<Awaited<ReturnType<PostRepository['findOnePost']>>>,
    likeCount: number,
    isLiked: boolean,
  ): PostItem {
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

  private toPostListResponse(
    result: Awaited<ReturnType<PostRepository['findPosts']>>,
  ): PostListResponse {
    const items = result.rows.map((r) =>
      this.toPostItem(
        r,
        result.likeCountMap.get(r.id) ?? 0,
        result.likedSet.has(r.id),
      ),
    );
    return { data: items, hasNext: result.hasNext, cursor: result.cursor };
  }

  async findOnePost(userId: number, postId: number): Promise<PostItem> {
    const row = await this.postRepository.findOnePost(postId);
    if (!row) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }

    const [likedPosts, likeCountMap] = await Promise.all([
      this.postRepository.getLikedPosts(userId, [postId]),
      this.postRepository.getLikeCounts([postId]),
    ]);

    return this.toPostItem(
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
