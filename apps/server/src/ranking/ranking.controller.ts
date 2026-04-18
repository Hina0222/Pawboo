import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { RankingService } from './ranking.service';
import {
  RankingQuerySchema,
  type RankingListResponse,
} from '@pawboo/schemas/ranking';

@Controller('rankings')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  findRanking(
    @Query() query: Record<string, string>,
  ): Promise<RankingListResponse> {
    const parsed = RankingQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.rankingService.findRanking(parsed.data);
  }
}
