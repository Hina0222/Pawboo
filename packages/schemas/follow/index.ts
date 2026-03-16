import {z} from 'zod';

export const FollowListQuerySchema = z.object({
  cursor: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const FollowItemSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  profileImage: z.string().nullable(),
  isFollowing: z.boolean(),
});

export const FollowListResponseSchema = z.object({
  data: z.array(FollowItemSchema),
  hasNext: z.boolean(),
  cursor: z.number().nullable(),
});

export const UserProfileResponseSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  profileImage: z.string().nullable(),
  followerCount: z.number(),
  followingCount: z.number(),
  isFollowing: z.boolean(),
  pets: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      imageUrl: z.string().nullable(),
      type: z.string(),
      isActive: z.boolean(),
    }),
  ),
});

export const UserSearchQuerySchema = z.object({
  q: z.string().min(1, '1글자 이상 입력해주세요'),
  cursor: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(30).default(20),
});

export const UserSearchResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      nickname: z.string(),
      profileImage: z.string().nullable(),
    }),
  ),
  hasNext: z.boolean(),
  cursor: z.number().nullable(),
});

export type FollowListQuery = z.infer<typeof FollowListQuerySchema>;
export type FollowItem = z.infer<typeof FollowItemSchema>;
export type FollowListResponse = z.infer<typeof FollowListResponseSchema>;
export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;
export type UserSearchQuery = z.infer<typeof UserSearchQuerySchema>;
export type UserSearchResponse = z.infer<typeof UserSearchResponseSchema>;
