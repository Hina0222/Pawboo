import { Injectable, Inject } from '@nestjs/common';
import { eq, and, lt, desc } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../database/database.provider';
import type { DrizzleDB } from '../database/database.provider';
import { posts } from '../database/schema';
import type { PostResponse } from '@pawboo/schemas/mission';

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

  async findById(postId: number): Promise<PostResponse | null> {
    const [post] = await this.db
      .select()
      .from(posts)
      .where(eq(posts.id, postId));
    return (post as PostResponse) ?? null;
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

  async getMissionHistory(petId: number, cursor?: number, limit: number = 20) {
    const rows = await this.db
      .select()
      .from(posts)
      .where(
        and(
          eq(posts.petId, petId),
          eq(posts.type, 'mission'),
          cursor ? lt(posts.id, cursor) : undefined,
        ),
      )
      .orderBy(desc(posts.createdAt))
      .limit(limit + 1);

    const hasNext = rows.length > limit;
    const data = hasNext ? rows.slice(0, limit) : rows;

    return {
      data: data as PostResponse[],
      hasNext,
      cursor: hasNext ? data[data.length - 1].id : null,
    };
  }

  async deletePost(postId: number): Promise<PostResponse | null> {
    const deleted = await this.db
      .delete(posts)
      .where(eq(posts.id, postId))
      .returning();

    return deleted.length > 0 ? (deleted[0] as PostResponse) : null;
  }
}
