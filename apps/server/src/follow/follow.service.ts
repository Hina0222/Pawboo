import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { eq, and, gt, inArray, sql } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../database/database.provider';
import type { DrizzleDB } from '../database/database.provider';
import { follows, users } from '../database/schema';
import type {
  FollowListQuery,
  FollowListResponse,
  FollowItem,
} from '@bragram/schemas/follow';

@Injectable()
export class FollowService {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: DrizzleDB) {}

  async follow(followerId: number, followingId: number): Promise<void> {
    if (followerId === followingId) {
      throw new BadRequestException('자기 자신을 팔로우할 수 없습니다.');
    }

    const target = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, followingId))
      .limit(1);

    if (target.length === 0) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const existing = await this.db
      .select({ id: follows.id })
      .from(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('이미 팔로우 중입니다.');
    }

    await this.db.transaction(async (tx) => {
      await tx.insert(follows).values({ followerId, followingId });
      await tx
        .update(users)
        .set({ followerCount: sql`follower_count + 1` })
        .where(eq(users.id, followingId));
      await tx
        .update(users)
        .set({ followingCount: sql`following_count + 1` })
        .where(eq(users.id, followerId));
    });
  }

  async unfollow(followerId: number, followingId: number): Promise<void> {
    const existing = await this.db
      .select({ id: follows.id })
      .from(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId),
        ),
      )
      .limit(1);

    if (existing.length === 0) {
      throw new NotFoundException('팔로우 관계가 존재하지 않습니다.');
    }

    await this.db.transaction(async (tx) => {
      await tx
        .delete(follows)
        .where(
          and(
            eq(follows.followerId, followerId),
            eq(follows.followingId, followingId),
          ),
        );
      await tx
        .update(users)
        .set({ followerCount: sql`follower_count - 1` })
        .where(eq(users.id, followingId));
      await tx
        .update(users)
        .set({ followingCount: sql`following_count - 1` })
        .where(eq(users.id, followerId));
    });
  }

  async getFollowers(
    requesterId: number,
    targetUserId: number,
    query: FollowListQuery,
  ): Promise<FollowListResponse> {
    const { cursor, limit } = query;

    const followerRows = await this.db
      .select({
        id: users.id,
        nickname: users.nickname,
        profileImage: users.profileImage,
        followId: follows.id,
      })
      .from(follows)
      .innerJoin(users, eq(follows.followerId, users.id))
      .where(
        cursor
          ? and(eq(follows.followingId, targetUserId), gt(follows.id, cursor))
          : eq(follows.followingId, targetUserId),
      )
      .orderBy(follows.id)
      .limit(limit + 1);

    const hasNext = followerRows.length > limit;
    const data = hasNext ? followerRows.slice(0, limit) : followerRows;

    // requester가 각 팔로워를 팔로우하는지 확인
    const followerIds = data.map((r) => r.id);
    const isFollowingSet = await this.getIsFollowingSet(
      requesterId,
      followerIds,
    );

    const items: FollowItem[] = data.map((r) => ({
      id: r.id,
      nickname: r.nickname,
      profileImage: r.profileImage ?? null,
      isFollowing: isFollowingSet.has(r.id),
    }));

    const lastItem = data[data.length - 1];

    return {
      data: items,
      hasNext,
      cursor: hasNext && lastItem ? lastItem.followId : null,
    };
  }

  async getFollowing(
    requesterId: number,
    targetUserId: number,
    query: FollowListQuery,
  ): Promise<FollowListResponse> {
    const { cursor, limit } = query;

    const followingRows = await this.db
      .select({
        id: users.id,
        nickname: users.nickname,
        profileImage: users.profileImage,
        followId: follows.id,
      })
      .from(follows)
      .innerJoin(users, eq(follows.followingId, users.id))
      .where(
        cursor
          ? and(eq(follows.followerId, targetUserId), gt(follows.id, cursor))
          : eq(follows.followerId, targetUserId),
      )
      .orderBy(follows.id)
      .limit(limit + 1);

    const hasNext = followingRows.length > limit;
    const data = hasNext ? followingRows.slice(0, limit) : followingRows;

    const followingIds = data.map((r) => r.id);
    const isFollowingSet = await this.getIsFollowingSet(
      requesterId,
      followingIds,
    );

    const items: FollowItem[] = data.map((r) => ({
      id: r.id,
      nickname: r.nickname,
      profileImage: r.profileImage ?? null,
      isFollowing: isFollowingSet.has(r.id),
    }));

    const lastItem = data[data.length - 1];

    return {
      data: items,
      hasNext,
      cursor: hasNext && lastItem ? lastItem.followId : null,
    };
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const result = await this.db
      .select({ id: follows.id })
      .from(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId),
        ),
      )
      .limit(1);
    return result.length > 0;
  }

  private async getIsFollowingSet(
    requesterId: number,
    userIds: number[],
  ): Promise<Set<number>> {
    if (userIds.length === 0) return new Set();

    const rows = await this.db
      .select({ followingId: follows.followingId })
      .from(follows)
      .where(
        and(
          eq(follows.followerId, requesterId),
          inArray(follows.followingId, userIds),
        ),
      );

    return new Set(rows.map((r) => r.followingId));
  }
}
