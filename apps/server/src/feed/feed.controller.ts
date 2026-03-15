import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FeedService } from './feed.service';
import {
  FeedQuerySchema,
  type FeedItem,
  type FeedListResponse,
} from '@bragram/schemas/feed';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.type';

@UseGuards(JwtAuthGuard)
@Controller('feeds')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  findFeed(
    @Req() req: AuthenticatedRequest,
    @Query() query: Record<string, string>,
  ): Promise<FeedListResponse> {
    const parsed = FeedQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.feedService.findFeed(req.user.id, parsed.data);
  }

  @Get(':id')
  findOneFeed(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<FeedItem> {
    return this.feedService.findOneFeed(req.user.id, +id);
  }
}
