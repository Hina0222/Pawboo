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
  CalendarPostListResponse,
  CalendarQuery,
  CalendarMonthResponse,
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
  ): Promise<CalendarPostListResponse> {
    const representativePet =
      await this.petRepository.findRepresentativeByUserId(userId);
    if (!representativePet) {
      return { data: [], hasNext: false, cursor: null };
    }
    return this.toCalendarPostListResponse(
      userId,
      await this.postRepository.findPosts(query, representativePet.id),
      {
        id: representativePet.id,
        name: representativePet.name,
        imageUrl: representativePet.imageUrl ?? null,
      },
    );
  }

  async findPetPosts(
    userId: number,
    petId: number,
    query: PostQuery,
  ): Promise<CalendarPostListResponse> {
    const pet = await this.petRepository.findById(petId);
    if (!pet) {
      return { data: [], hasNext: false, cursor: null };
    }
    return this.toCalendarPostListResponse(
      userId,
      await this.postRepository.findPosts(query, petId),
      { id: pet.id, name: pet.name, imageUrl: pet.imageUrl ?? null },
    );
  }

  async findCalendarDays(
    userId: number,
    query: CalendarQuery,
  ): Promise<CalendarMonthResponse> {
    const petId =
      query.petId ??
      (await this.petRepository.findRepresentativeByUserId(userId))?.id;
    if (!petId) {
      return [];
    }
    const [fromUtc, toUtc] = this.monthRangeUtc(query.month);
    return this.postRepository.findCalendarDays(petId, fromUtc, toUtc);
  }

  // 한국은 DST 없음(UTC+9 고정) → repository의 interval '9 hours'와 짝이 맞는다.
  // Date.UTC의 월 오버플로가 12월 롤오버를 처리한다.
  private monthRangeUtc(month: string): [Date, Date] {
    const [y, m] = month.split('-').map(Number);
    return [
      new Date(Date.UTC(y, m - 1, 1, -9)),
      new Date(Date.UTC(y, m, 1, -9)),
    ];
  }

  private async toCalendarPostListResponse(
    userId: number,
    result: { rows: PostListRow[]; hasNext: boolean; cursor: number | null },
    pet: { id: number; name: string; imageUrl: string | null },
  ): Promise<CalendarPostListResponse> {
    const ids = result.rows.map((r) => r.id);
    const [likedSet, likeCountMap] = await Promise.all([
      this.postRepository.getLikedPosts(userId, ids),
      this.postRepository.getLikeCounts(ids),
    ]);
    return {
      data: result.rows.map((r) => ({
        id: r.id,
        type: r.type,
        missionId: r.missionId ?? null,
        imageUrls: r.imageUrls,
        createdAt: r.createdAt.toISOString(),
        pet,
        likeCount: likeCountMap.get(r.id) ?? 0,
        isLiked: likedSet.has(r.id),
      })),
      hasNext: result.hasNext,
      cursor: result.cursor,
    };
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
