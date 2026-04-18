import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { eq, and, gt, asc, isNull, sql } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../database/database.provider';
import type { DrizzleDB } from '../database/database.provider';
import { comments, missionSubmissions, users } from '../database/schema';
import type {
  CreateCommentRequest,
  CommentItem,
  CommentListResponse,
} from '@pawboo/schemas/comment';

@Injectable()
export class CommentService {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: DrizzleDB) {}

  async getComments(
    submissionId: number,
    cursor?: number,
    limit = 20,
  ): Promise<CommentListResponse> {
    const conditions = [
      eq(comments.submissionId, submissionId),
      isNull(comments.parentId),
    ];
    if (cursor) {
      conditions.push(gt(comments.id, cursor));
    }

    const rows = await this.db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        authorId: users.id,
        authorNickname: users.nickname,
        authorProfileImage: users.profileImage,
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(and(...conditions))
      .orderBy(asc(comments.id))
      .limit(limit + 1);

    const hasNext = rows.length > limit;
    const data = hasNext ? rows.slice(0, limit) : rows;

    const items: CommentItem[] = data.map((r) => ({
      id: r.id,
      content: r.content,
      createdAt: r.createdAt.toISOString(),
      author: {
        id: r.authorId,
        nickname: r.authorNickname!,
        profileImage: r.authorProfileImage ?? null,
      },
    }));

    return {
      data: items,
      hasNext,
      cursor: hasNext && data.length > 0 ? data[data.length - 1].id : null,
    };
  }

  async createComment(
    userId: number,
    submissionId: number,
    dto: CreateCommentRequest,
  ): Promise<CommentItem> {
    const [submission] = await this.db
      .select({ id: missionSubmissions.id })
      .from(missionSubmissions)
      .where(eq(missionSubmissions.id, submissionId));

    if (!submission) {
      throw new NotFoundException('제출 내역을 찾을 수 없습니다.');
    }

    const [user] = await this.db
      .select({
        nickname: users.nickname,
        profileImage: users.profileImage,
        id: users.id,
      })
      .from(users)
      .where(eq(users.id, userId));

    const result = await this.db.transaction(async (tx) => {
      const [inserted] = await tx
        .insert(comments)
        .values({ submissionId, userId, content: dto.content })
        .returning();

      await tx
        .update(missionSubmissions)
        .set({ commentCount: sql`${missionSubmissions.commentCount} + 1` })
        .where(eq(missionSubmissions.id, submissionId));

      return inserted;
    });

    return {
      id: result.id,
      content: result.content,
      createdAt: result.createdAt.toISOString(),
      author: {
        id: user.id,
        nickname: user.nickname!,
        profileImage: user.profileImage ?? null,
      },
    };
  }

  async deleteComment(userId: number, commentId: number): Promise<void> {
    const [comment] = await this.db
      .select({
        id: comments.id,
        userId: comments.userId,
        submissionId: comments.submissionId,
      })
      .from(comments)
      .where(eq(comments.id, commentId));

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    await this.db.transaction(async (tx) => {
      await tx.delete(comments).where(eq(comments.id, commentId));

      await tx
        .update(missionSubmissions)
        .set({
          commentCount: sql`GREATEST
              (${missionSubmissions.commentCount} - 1, 0)`,
        })
        .where(eq(missionSubmissions.id, comment.submissionId));
    });
  }
}
