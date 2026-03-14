import { Injectable, Inject } from '@nestjs/common';
import { eq, and, lt, sql, inArray } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../database/database.provider';
import type { DrizzleDB } from '../database/database.provider';
import {
  missionSubmissions,
  pets,
  users,
  missions,
  likes,
} from '../database/schema';
import type {
  FeedQuery,
  FeedItem,
  FeedListResponse,
} from '@bragram/schemas/feed';

const FEED_LIMIT = 20;

@Injectable()
export class FeedService {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: DrizzleDB) {}

  async findFeed(userId: number, query: FeedQuery): Promise<FeedListResponse> {
    const { sort, cursor } = query;

    const baseQuery = this.db
      .select({
        id: missionSubmissions.id,
        imageUrl: missionSubmissions.imageUrl,
        hashtags: missionSubmissions.hashtags,
        createdAt: missionSubmissions.createdAt,
        likeCount: missionSubmissions.likeCount,
        commentCount: missionSubmissions.commentCount,
        petId: pets.id,
        petName: pets.name,
        petImageUrl: pets.imageUrl,
        ownerNickname: users.nickname,
        missionTitle: missions.title,
      })
      .from(missionSubmissions)
      .innerJoin(pets, eq(missionSubmissions.petId, pets.id))
      .innerJoin(users, eq(pets.userId, users.id))
      .innerJoin(missions, eq(missionSubmissions.missionId, missions.id));

    const orderBy =
      sort === 'popular'
        ? sql`${missionSubmissions.likeCount} DESC,
              ${missionSubmissions.id}
              DESC`
        : sql`${missionSubmissions.id} DESC`;

    const rows = await (cursor
      ? baseQuery
          .where(lt(missionSubmissions.id, cursor))
          .orderBy(orderBy)
          .limit(FEED_LIMIT + 1)
      : baseQuery.orderBy(orderBy).limit(FEED_LIMIT + 1));

    const hasNext = rows.length > FEED_LIMIT;
    const data = hasNext ? rows.slice(0, FEED_LIMIT) : rows;

    // isLiked 배치 조회
    let likedSet = new Set<number>();
    if (data.length > 0) {
      const submissionIds = data.map((r) => r.id);
      const likedRows = await this.db
        .select({ submissionId: likes.submissionId })
        .from(likes)
        .where(
          and(
            eq(likes.userId, userId),
            inArray(likes.submissionId, submissionIds),
          ),
        );
      likedSet = new Set(likedRows.map((r) => r.submissionId));
    }

    const feedItems: FeedItem[] = data.map((r) => ({
      id: r.id,
      imageUrl: r.imageUrl,
      hashtags: r.hashtags ?? null,
      createdAt: r.createdAt.toISOString(),
      pet: { id: r.petId, name: r.petName, imageUrl: r.petImageUrl ?? null },
      owner: { nickname: r.ownerNickname },
      missionTitle: r.missionTitle,
      likeCount: r.likeCount,
      commentCount: r.commentCount,
      isLiked: likedSet.has(r.id),
    }));

    const lastItem = data[data.length - 1];

    return {
      data: feedItems,
      hasNext,
      cursor: hasNext && lastItem ? lastItem.id : null,
    };
  }
}
