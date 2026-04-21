import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../database/database.provider';
import type { DrizzleDB } from '../database/database.provider';
import { reports, posts } from '../database/schema';
import type { ReportReason } from '@pawboo/schemas/report';

@Injectable()
export class ReportRepository {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: DrizzleDB) {}

  async createReport(
    postId: number,
    reporterId: number,
    reason: ReportReason,
  ): Promise<void> {
    await this.db.insert(reports).values({
      postId,
      reporterId,
      reason,
    });
  }

  async existsPost(postId: number): Promise<boolean> {
    const [post] = await this.db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, postId));
    return !!post;
  }
}
