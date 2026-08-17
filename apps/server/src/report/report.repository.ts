import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE_ORM } from '../database/database.provider';
import type { DrizzleDB } from '../database/database.provider';
import { reports } from '../database/schema';
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
}
