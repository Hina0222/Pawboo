import { Injectable, Inject } from '@nestjs/common';
import { eq, and, lt, desc, inArray, count } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../database/database.provider';
import type { DrizzleDB } from '../database/database.provider';
import { posts, pets, postLikes } from '../database/schema';
import type { PostResponse, PostQuery } from '@pawboo/schemas/post';

@Injectable()
export class PostRepository {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: DrizzleDB) {}

  async createPost(data: {
    petId: number;
    type: 'general' | 'mission';
    missionId: number | null;
    imageUrls: string[];
  }): Promise<PostResponse> {
    const [post] = await this.db.insert(posts).values(data).returning();
    return post as PostResponse;
  }

  async findByMissionIdAndPetId(
    missionId: number,
    petId: number,
  ): Promise<PostResponse | null> {
    const [post] = await this.db
      .select()
      .from(posts)
      .where(and(eq(posts.missionId, missionId), eq(posts.petId, petId)));
    return (post as PostResponse) ?? null;
  }

  async findPosts(viewerId: number, query: PostQuery, targetPetId?: number) {
    const { cursor, missionId } = query;
    const LIMIT = 20;

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
          targetPetId !== undefined ? eq(posts.petId, targetPetId) : undefined,
          cursor ? lt(posts.id, cursor) : undefined,
          missionId ? eq(posts.missionId, missionId) : undefined,
        ),
      )
      .orderBy(desc(posts.id))
      .limit(LIMIT + 1);

    const hasNext = rows.length > LIMIT;
    const data = hasNext ? rows.slice(0, LIMIT) : rows;

    let likedSet = new Set<number>();
    if (data.length > 0) {
      const postIds = data.map((r) => r.id);
      const likedRows = await this.db
        .select({ postId: postLikes.postId })
        .from(postLikes)
        .where(
          and(
            eq(postLikes.userId, viewerId),
            inArray(postLikes.postId, postIds),
          ),
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

  async deletePost(postId: number): Promise<PostResponse | null> {
    const deleted = await this.db
      .delete(posts)
      .where(eq(posts.id, postId))
      .returning();
    return deleted.length > 0 ? (deleted[0] as PostResponse) : null;
  }

  async getLikeCounts(postIds: number[]): Promise<Map<number, number>> {
    if (postIds.length === 0) return new Map();
    const rows = await this.db
      .select({ postId: postLikes.postId, count: count() })
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
