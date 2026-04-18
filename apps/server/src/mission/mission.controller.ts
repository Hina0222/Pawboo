import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
  UploadedFiles,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MissionService } from './mission.service';
import { ImagesUpload } from '../common/decorators/image-upload.decorator';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.type';
import {
  CreateSubmissionSchema,
  SubmissionHistoryQuerySchema,
  type SubmissionHistoryResponse,
  type SubmissionResponse,
  type TodayMissionResponse,
} from '@pawboo/schemas/mission';

@UseGuards(JwtAuthGuard)
@Controller('missions')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get('today')
  findToday(@Req() req: AuthenticatedRequest): Promise<TodayMissionResponse> {
    return this.missionService.findToday(req.user.id);
  }

  @Get('submissions/history')
  async findHistory(
    @Req() req: AuthenticatedRequest,
    @Query() query: Record<string, string>,
  ): Promise<SubmissionHistoryResponse> {
    const parsed = SubmissionHistoryQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.missionService.findHistory(req.user.id, parsed.data);
  }

  @Post(':missionId/submissions')
  @ImagesUpload()
  async submit(
    @Req() req: AuthenticatedRequest,
    @Param('missionId', ParseIntPipe) missionId: number,
    @Body() body: Record<string, unknown>,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<SubmissionResponse> {
    if (!files || files.length === 0) {
      throw new BadRequestException('이미지를 1장 이상 업로드해주세요.');
    }
    if (files.length > 5) {
      throw new BadRequestException('이미지는 최대 5장까지 업로드 가능합니다.');
    }

    const parsed = CreateSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }

    return this.missionService.submitMission(
      req.user.id,
      missionId,
      files.map((f) => f.buffer),
      parsed.data,
    );
  }

  @Delete(':missionId/submissions/:submissionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSubmission(
    @Req() req: AuthenticatedRequest,
    @Param('missionId', ParseIntPipe) missionId: number,
    @Param('submissionId', ParseIntPipe) submissionId: number,
  ): Promise<void> {
    return this.missionService.deleteSubmission(
      req.user.id,
      missionId,
      submissionId,
    );
  }
}
