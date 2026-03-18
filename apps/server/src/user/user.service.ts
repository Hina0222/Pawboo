import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { eq, ilike, and, gt, lt, inArray, desc } from 'drizzle-orm';
import type { DrizzleDB } from '../database/database.provider';
import { DRIZZLE_ORM } from '../database/database.provider';
import {
  users,
  pets,
  follows,
  missionSubmissions,
  missions,
  likes,
} from '../database/schema';
import { AwsService, IMAGE_PRESET } from '../aws/aws.service';
import type { ProfileUpdateRequest } from '@bragram/schemas/user';
import type {
  UserSearchQuery,
  UserSearchResponse,
  UserProfileResponse,
} from '@bragram/schemas/user';
import type { FeedItem, FeedListResponse } from '@bragram/schemas/feed';

interface KakaoProfile {
  kakaoId: string;
  nickname: string;
  profileImage?: string;
}

@Injectable()
export class UserService {
  constructor(
    @Inject(DRIZZLE_ORM) private db: DrizzleDB,
    private readonly awsService: AwsService,
  ) {}

  async findByKakaoId(kakaoId: string) {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.kakaoId, kakaoId))
      .limit(1);
    return result[0] ?? null;
  }

  async findById(id: number) {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  async findOrCreate(profile: KakaoProfile) {
    const existing = await this.findByKakaoId(profile.kakaoId);
    if (existing) return existing;

    const created = await this.db
      .insert(users)
      .values({
        kakaoId: profile.kakaoId,
        nickname: profile.nickname,
        profileImage: profile.profileImage,
      })
      .returning();
    return created[0];
  }

  async updateRefreshToken(id: number, refreshToken: string | null) {
    await this.db
      .update(users)
      .set({ refreshToken, updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  async searchUsers(
    requesterId: number,
    query: UserSearchQuery,
  ): Promise<UserSearchResponse> {
    const { q, cursor, limit } = query;

    const rows = await this.db
      .select({
        id: users.id,
        nickname: users.nickname,
        profileImage: users.profileImage,
      })
      .from(users)
      .where(
        cursor
          ? and(ilike(users.nickname, `%${q}%`), gt(users.id, cursor))
          : ilike(users.nickname, `%${q}%`),
      )
      .orderBy(users.id)
      .limit(limit + 1);

    const hasNext = rows.length > limit;
    const data = hasNext ? rows.slice(0, limit) : rows;
    const lastItem = data[data.length - 1];

    return {
      data: data.map((r) => ({
        id: r.id,
        nickname: r.nickname,
        profileImage: r.profileImage ?? null,
      })),
      hasNext,
      cursor: hasNext && lastItem ? lastItem.id : null,
    };
  }

  async getPublicProfile(
    requesterId: number,
    targetId: number,
  ): Promise<UserProfileResponse> {
    const userRows = await this.db
      .select({
        id: users.id,
        nickname: users.nickname,
        profileImage: users.profileImage,
        followerCount: users.followerCount,
        followingCount: users.followingCount,
      })
      .from(users)
      .where(eq(users.id, targetId))
      .limit(1);

    if (userRows.length === 0) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const user = userRows[0];

    const [isFollowingResult, petRows] = await Promise.all([
      requesterId !== targetId
        ? this.db
            .select({ id: follows.id })
            .from(follows)
            .where(
              and(
                eq(follows.followerId, requesterId),
                eq(follows.followingId, targetId),
              ),
            )
            .limit(1)
        : Promise.resolve([]),
      this.db
        .select({
          id: pets.id,
          name: pets.name,
          imageUrl: pets.imageUrl,
          type: pets.type,
          isActive: pets.isActive,
        })
        .from(pets)
        .where(eq(pets.userId, targetId))
        .orderBy(pets.createdAt),
    ]);

    return {
      id: user.id,
      nickname: user.nickname,
      profileImage: user.profileImage ?? null,
      followerCount: user.followerCount,
      followingCount: user.followingCount,
      isFollowing: isFollowingResult.length > 0,
      pets: petRows.map((p) => ({
        id: p.id,
        name: p.name,
        imageUrl: p.imageUrl ?? null,
        type: p.type,
        isActive: p.isActive,
      })),
    };
  }

  async getUserFeeds(
    requesterId: number,
    targetId: number,
    query: { cursor?: number; limit?: number },
  ): Promise<FeedListResponse> {
    const limit = query.limit ?? 20;
    const cursor = query.cursor;

    const rows = await this.db
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
        ownerId: users.id,
        ownerNickname: users.nickname,
        missionTitle: missions.title,
      })
      .from(missionSubmissions)
      .innerJoin(pets, eq(missionSubmissions.petId, pets.id))
      .innerJoin(users, eq(pets.userId, users.id))
      .innerJoin(missions, eq(missionSubmissions.missionId, missions.id))
      .where(
        and(
          eq(pets.userId, targetId),
          cursor ? lt(missionSubmissions.id, cursor) : undefined,
        ),
      )
      .orderBy(desc(missionSubmissions.id))
      .limit(limit + 1);

    const hasNext = rows.length > limit;
    const data = hasNext ? rows.slice(0, limit) : rows;

    let likedSet = new Set<number>();
    if (data.length > 0) {
      const submissionIds = data.map((r) => r.id);
      const likedRows = await this.db
        .select({ submissionId: likes.submissionId })
        .from(likes)
        .where(
          and(
            eq(likes.userId, requesterId),
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
      owner: { id: r.ownerId, nickname: r.ownerNickname },
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

  async updateMe(
    userId: number,
    input: ProfileUpdateRequest,
    imageBuffer?: Buffer,
  ) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (input.nickname === undefined && imageBuffer === undefined) {
      throw new BadRequestException('변경할 내용이 없습니다.');
    }

    let profileImage = user.profileImage;

    if (imageBuffer) {
      profileImage = await this.awsService.uploadImage(
        imageBuffer,
        IMAGE_PRESET.PET_THUMBNAIL,
      );
      if (user.profileImage) {
        await this.awsService.deleteImage(user.profileImage);
      }
    }

    const [updated] = await this.db
      .update(users)
      .set({
        ...(input.nickname !== undefined && { nickname: input.nickname }),
        profileImage,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return {
      id: updated.id,
      nickname: updated.nickname,
      profileImage: updated.profileImage ?? null,
    };
  }
}
