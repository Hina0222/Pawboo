import { Injectable, Inject } from '@nestjs/common';
import { desc, asc, eq } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../database/database.provider';
import type { DrizzleDB } from '../database/database.provider';
import { pets, users } from '../database/schema';
import type {
  RankingQuery,
  RankingItem,
  RankingListResponse,
} from '@pawboo/schemas/ranking';

const RANKING_LIMIT = 20;

@Injectable()
export class RankingService {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: DrizzleDB) {}

  async findRanking(query: RankingQuery): Promise<RankingListResponse> {
    const { type, cursor } = query;

    const scoreCol =
      type === 'weekly'
        ? pets.weeklyScore
        : type === 'monthly'
          ? pets.monthlyScore
          : pets.score;

    const rows = await this.db
      .select({
        petId: pets.id,
        petName: pets.name,
        petType: pets.type,
        petImageUrl: pets.imageUrl,
        score: scoreCol,
        ownerNickname: users.nickname,
        ownerProfileImage: users.profileImage,
      })
      .from(pets)
      .innerJoin(users, eq(pets.userId, users.id))
      .orderBy(desc(scoreCol), asc(pets.id))
      .limit(RANKING_LIMIT + 1)
      .offset(cursor);

    const hasNext = rows.length > RANKING_LIMIT;
    const data = hasNext ? rows.slice(0, RANKING_LIMIT) : rows;

    const items: RankingItem[] = data.map((r, i) => ({
      rank: cursor + i + 1,
      petId: r.petId,
      petName: r.petName,
      petType: r.petType,
      petImageUrl: r.petImageUrl ?? null,
      score: r.score,
      ownerNickname: r.ownerNickname!,
      ownerProfileImage: r.ownerProfileImage ?? null,
    }));

    return {
      data: items,
      hasNext,
      cursor: hasNext ? cursor + RANKING_LIMIT : null,
    };
  }
}
