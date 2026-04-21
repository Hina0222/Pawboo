import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MissionService } from './mission.service';
import {
  ImagesUpload,
  ImagesValidationPipe,
} from '../common/decorators/image-upload.decorator';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.type';
import type { PostResponse } from '@pawboo/schemas/post';
import type { TodayMissionResponse } from '@pawboo/schemas/mission';

@UseGuards(JwtAuthGuard)
@Controller('missions')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get('today')
  findToday(@Req() req: AuthenticatedRequest): Promise<TodayMissionResponse> {
    return this.missionService.findToday(req.user.id);
  }

  @Post(':missionId/submissions')
  @ImagesUpload()
  async submit(
    @Req() req: AuthenticatedRequest,
    @Param('missionId', ParseIntPipe) missionId: number,
    @UploadedFiles(new ImagesValidationPipe()) files: Express.Multer.File[],
  ): Promise<PostResponse> {
    return this.missionService.submitMission(
      req.user.id,
      missionId,
      files.map((f) => f.buffer),
    );
  }
}
