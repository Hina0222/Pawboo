import {
  Controller,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LikeService } from './like.service';
import type { LikeResponse } from '@pawboo/schemas/like';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.type';

@UseGuards(JwtAuthGuard)
@Controller('feeds')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':submissionId/likes')
  @HttpCode(HttpStatus.OK)
  addLike(
    @Req() req: AuthenticatedRequest,
    @Param('submissionId', ParseIntPipe) submissionId: number,
  ): Promise<LikeResponse> {
    return this.likeService.addLike(req.user.id, submissionId);
  }

  @Delete(':submissionId/likes')
  @HttpCode(HttpStatus.OK)
  removeLike(
    @Req() req: AuthenticatedRequest,
    @Param('submissionId', ParseIntPipe) submissionId: number,
  ): Promise<LikeResponse> {
    return this.likeService.removeLike(req.user.id, submissionId);
  }
}
