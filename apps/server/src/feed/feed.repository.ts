import { Injectable, Inject } from '@nestjs/common';
import { eq, and, lt, inArray, desc, count } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../database/database.provider';
import type { DrizzleDB } from '../database/database.provider';
import { posts, pets, postLikes } from '../database/schema';
import type { FeedQuery } from '@pawboo/schemas/feed';

const FEED_LIMIT = 20;

@Injectable()
export class FeedRepository {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: DrizzleDB) {}

  async findFeed(userId: number, query: FeedQuery) {
    const { cursor, missionId } = query;

    const rows = await this.db
      .select({
        id: posts.id,
        type: posts.type,
        missionId: posts.missionId,
        imageUrls: posts.imageUrls,
        createdAt: posts.createdAt,
        petId: pets.id,
        petName: pets.name,
        petImageUrl: pets.imageUrl,
      })
      .from(posts)
      .innerJoin(pets, eq(posts.petId, pets.id))
      .where(
        and(
          cursor ? lt(posts.id, cursor) : undefined,
          missionId ? eq(posts.missionId, missionId) : undefined,
        ),
      )
      .orderBy(desc(posts.id))
      .limit(FEED_LIMIT + 1);

    const hasNext = rows.length > FEED_LIMIT;
    const data = hasNext ? rows.slice(0, FEED_LIMIT) : rows;

    let likedSet = new Set<number>();
    if (data.length > 0) {
      const postIds = data.map((r) => r.id);
      const likedRows = await this.db
        .select({ postId: postLikes.postId })
        .from(postLikes)
        .where(
          and(eq(postLikes.userId, userId), inArray(postLikes.postId, postIds)),
        );
      likedSet = new Set(likedRows.map((r) => r.postId));
    }

    const likeCountMap = await this.getLikeCounts(data.map((r) => r.id));

    const lastItem = data[data.length - 1];

    return {
      rows: data,
      likedSet,
      likeCountMap,
      hasNext,
      cursor: hasNext && lastItem ? lastItem.id : null,
    };
  }

  async findOnePost(postId: number) {
    const [row] = await this.db
      .select({
        id: posts.id,
        type: posts.type,
        missionId: posts.missionId,
        imageUrls: posts.imageUrls,
        createdAt: posts.createdAt,
        petId: pets.id,
        petName: pets.name,
        petImageUrl: pets.imageUrl,
      })
      .from(posts)
      .innerJoin(pets, eq(posts.petId, pets.id))
      .where(eq(posts.id, postId))
      .limit(1);

    return row ?? null;
  }

  async findPostWithOwner(postId: number, userId: number) {
    const [post] = await this.db
      .select({ id: posts.id, imageUrls: posts.imageUrls })
      .from(posts)
      .innerJoin(pets, eq(posts.petId, pets.id))
      .where(and(eq(posts.id, postId), eq(pets.userId, userId)));

    return post ?? null;
  }

  async deletePost(postId: number) {
    await this.db.delete(posts).where(eq(posts.id, postId));
  }

  async getLikeCounts(postIds: number[]): Promise<Map<number, number>> {
    if (postIds.length === 0) return new Map();

    const rows = await this.db
      .select({
        postId: postLikes.postId,
        count: count(),
      })
      .from(postLikes)
      .where(inArray(postLikes.postId, postIds))
      .groupBy(postLikes.postId);

    return new Map(rows.map((r) => [r.postId, r.count]));
  }

  async getLikedPosts(userId: number, postIds: number[]) {
    if (postIds.length === 0) return new Map();
    const rows = await this.db
      .select({ postId: postLikes.postId })
      .from(postLikes)
      .where(
        and(eq(postLikes.userId, userId), inArray(postLikes.postId, postIds)),
      );

    return new Map(rows.map((r) => [r.postId, true]));
  }
}
