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

  async findMissionSubmission(
    userId: number,
    missionId: number,
  ): Promise<PostResponse | null> {
    const representativePet =
      await this.petRepository.findRepresentativeByUserId(userId);
    if (!representativePet) {
      return null;
    }
    return this.postRepository.findByMissionIdAndPetId(
      missionId,
      representativePet.id,
    );
  }

  async findPosts(userId: number, query: PostQuery): Promise<PostListResponse> {
    const result = await this.postRepository.findPosts(userId, query);

    const items: PostItem[] = result.rows.map((r) => ({
      id: r.id,
      type: r.type,
      missionId: r.missionId ?? null,
      imageUrls: r.imageUrls,
      createdAt: r.createdAt.toISOString(),
      pet: { id: r.petId, name: r.petName, imageUrl: r.petImageUrl ?? null },
      likeCount: result.likeCountMap.get(r.id) ?? 0,
      isLiked: result.likedSet.has(r.id),
    }));

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
      likeCount: likeCountMap.get(postId) ?? 0,
      isLiked: likedPosts.has(postId),
    };
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
