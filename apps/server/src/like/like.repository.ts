import { Injectable, Inject } from '@nestjs/common';
import { eq, and, count } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../database/database.provider';
import type { DrizzleDB } from '../database/database.provider';
import { postLikes, posts } from '../database/schema';

@Injectable()
export class LikeRepository {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: DrizzleDB) {}

  async addLike(postId: number, userId: number): Promise<void> {
    await this.db.insert(postLikes).values({ postId, userId });
  }

  async removeLike(postId: number, userId: number): Promise<number> {
    const deleted = await this.db
      .delete(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)))
      .returning({ id: postLikes.id });

    return deleted.length;
  }

  async countByPostId(postId: number): Promise<number> {
    const [{ cnt }] = await this.db
      .select({ cnt: count() })
      .from(postLikes)
      .where(eq(postLikes.postId, postId));

    return cnt;
  }

  async existsPost(postId: number): Promise<boolean> {
    const [post] = await this.db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, postId));
    return !!post;
  }
}
