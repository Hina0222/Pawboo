import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ReportRepository } from './report.repository';
import type { CreateReportRequest } from '@pawboo/schemas/report';

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  async createReport(
    reporterId: number,
    postId: number,
    input: CreateReportRequest,
  ): Promise<void> {
    const exists = await this.reportRepository.existsPost(postId);
    if (!exists) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }

    try {
      await this.reportRepository.createReport(
        postId,
        reporterId,
        input.reason,
      );
    } catch (err: unknown) {
      const pgErr = err as { cause?: { code?: string } };
      if (pgErr?.cause?.code === '23505') {
        throw new ConflictException('이미 신고한 게시물입니다.');
      }
      throw err;
    }
  }
}
