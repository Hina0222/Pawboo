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

export type FollowListQuery = z.infer<typeof FollowListQuerySchema>;
export type FollowItem = z.infer<typeof FollowItemSchema>;
export type FollowListResponse = z.infer<typeof FollowListResponseSchema>;
