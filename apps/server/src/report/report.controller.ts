import {
  Controller,
  Post,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportService } from './report.service';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.type';
import { CreateReportSchema } from '@pawboo/schemas/report';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post(':postId/report')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createReport(
    @Req() req: AuthenticatedRequest,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: unknown,
  ): Promise<void> {
    const parsed = CreateReportSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.reportService.createReport(req.user.id, postId, parsed.data);
  }
}
