import {z} from "zod";

export const MeResponseSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  profileImage: z.string().nullable(),
  followerCount: z.number(),
  followingCount: z.number(),
});

export const ProfileUpdateSchema = z.object({
  nickname: z.string().min(1).max(20).optional(),
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

export type MeResponse = z.infer<typeof MeResponseSchema>;
export type ProfileUpdateRequest = z.infer<typeof ProfileUpdateSchema>;
export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;
export type UserSearchQuery = z.infer<typeof UserSearchQuerySchema>;
export type UserSearchResponse = z.infer<typeof UserSearchResponseSchema>;
