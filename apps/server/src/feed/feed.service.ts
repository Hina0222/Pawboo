import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedRepository } from './feed.repository';
import type {
  FeedItem,
  FeedListResponse,
  FeedQuery,
} from '@pawboo/schemas/feed';

@Injectable()
export class FeedService {
  constructor(private readonly feedRepository: FeedRepository) {}

  async findFeed(userId: number, query: FeedQuery): Promise<FeedListResponse> {
    const result = await this.feedRepository.findFeed(userId, query);

    const feedItems: FeedItem[] = result.rows.map((r) => ({
      id: r.id,
      type: r.type,
      missionId: r.missionId ?? null,
      imageUrls: r.imageUrls,
      createdAt: r.createdAt.toISOString(),
      pet: { id: r.petId, name: r.petName, imageUrl: r.petImageUrl ?? null },
      likeCount: result.likeCountMap.get(r.id) ?? 0,
      isLiked: result.likedSet.has(r.id),
    }));

    return {
      data: feedItems,
      hasNext: result.hasNext,
      cursor: result.cursor,
    };
  }

  async findOneFeed(userId: number, postId: number): Promise<FeedItem> {
    const row = await this.feedRepository.findOnePost(postId);
    if (!row) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }

    const [likedPosts, likeCountMap] = await Promise.all([
      this.feedRepository.getLikedPosts(userId, [postId]),
      this.feedRepository.getLikeCounts([postId]),
    ]);
    const likeCount = likeCountMap.get(postId) ?? 0;

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
      isLiked: likedPosts.has(postId),
    };
  }

  async deleteFeed(userId: number, postId: number): Promise<void> {
    const post = await this.feedRepository.findPostWithOwner(postId, userId);
    if (!post) {
      throw new NotFoundException(
        '게시물을 찾을 수 없거나 삭제 권한이 없습니다.',
      );
    }

    await this.feedRepository.deletePost(postId);
  }
}
