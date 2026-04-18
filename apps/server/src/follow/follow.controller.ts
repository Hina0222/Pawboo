import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FollowService } from './follow.service';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.type';
import {
  FollowListQuerySchema,
  type FollowListResponse,
} from '@pawboo/schemas/follow';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':id/follow')
  @HttpCode(HttpStatus.CREATED)
  follow(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.followService.follow(req.user.id, id);
  }

  @Delete(':id/follow')
  @HttpCode(HttpStatus.NO_CONTENT)
  unfollow(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.followService.unfollow(req.user.id, id);
  }

  @Get(':id/followers')
  getFollowers(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Query() query: Record<string, string>,
  ): Promise<FollowListResponse> {
    const parsed = FollowListQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.followService.getFollowers(req.user.id, id, parsed.data);
  }

  @Get(':id/following')
  getFollowing(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Query() query: Record<string, string>,
  ): Promise<FollowListResponse> {
    const parsed = FollowListQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.followService.getFollowing(req.user.id, id, parsed.data);
  }
}
