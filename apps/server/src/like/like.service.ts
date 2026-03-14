import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { eq, and, sql } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../database/database.provider';
import type { DrizzleDB } from '../database/database.provider';
import { likes, missionSubmissions } from '../database/schema';
import type { LikeResponse } from '@bragram/schemas/like';

@Injectable()
export class LikeService {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: DrizzleDB) {}

  async addLike(userId: number, submissionId: number): Promise<LikeResponse> {
    const [submission] = await this.db
      .select({
        id: missionSubmissions.id,
        likeCount: missionSubmissions.likeCount,
      })
      .from(missionSubmissions)
      .where(eq(missionSubmissions.id, submissionId));

    if (!submission) {
      throw new NotFoundException('제출 내역을 찾을 수 없습니다.');
    }

    try {
      const updatedSubmission = await this.db.transaction(async (tx) => {
        await tx.insert(likes).values({ submissionId, userId });

        const [updated] = await tx
          .update(missionSubmissions)
          .set({ likeCount: sql`${missionSubmissions.likeCount} + 1` })
          .where(eq(missionSubmissions.id, submissionId))
          .returning({ likeCount: missionSubmissions.likeCount });

        return updated;
      });

      return { likeCount: updatedSubmission.likeCount, isLiked: true };
    } catch (err: unknown) {
      const pgErr = err as { cause?: { code?: string } };
      if (pgErr?.cause?.code === '23505') {
        throw new ConflictException('이미 좋아요를 눌렀습니다.');
      }
      throw err;
    }
  }

  async removeLike(
    userId: number,
    submissionId: number,
  ): Promise<LikeResponse> {
    const updatedSubmission = await this.db.transaction(async (tx) => {
      const deleted = await tx
        .delete(likes)
        .where(
          and(eq(likes.submissionId, submissionId), eq(likes.userId, userId)),
        )
        .returning({ id: likes.id });

      if (deleted.length === 0) {
        throw new NotFoundException('좋아요를 찾을 수 없습니다.');
      }

      const [updated] = await tx
        .update(missionSubmissions)
        .set({
          likeCount: sql`GREATEST
              (${missionSubmissions.likeCount} - 1, 0)`,
        })
        .where(eq(missionSubmissions.id, submissionId))
        .returning({ likeCount: missionSubmissions.likeCount });

      return updated;
    });

    return { likeCount: updatedSubmission.likeCount, isLiked: false };
  }
}
