import {z} from 'zod';

export const FeedQuerySchema = z.object({
  sort: z.enum(['latest', 'popular']).default('latest'),
  cursor: z.coerce.number().int().positive().optional(),
});

export const FeedItemSchema = z.object({
  id: z.number(),
  imageUrl: z.string(),
  hashtags: z.array(z.string()).nullable(),
  createdAt: z.string(),
  pet: z.object({id: z.number(), name: z.string(), imageUrl: z.string().nullable()}),
  owner: z.object({nickname: z.string()}),
  missionTitle: z.string(),
  likeCount: z.number(),
  commentCount: z.number(),
  isLiked: z.boolean(),
});

export const FeedListResponseSchema = z.object({
  data: z.array(FeedItemSchema),
  hasNext: z.boolean(),
  cursor: z.number().nullable(),
});

export type FeedQuery = z.infer<typeof FeedQuerySchema>;
export type FeedItem = z.infer<typeof FeedItemSchema>;
export type FeedListResponse = z.infer<typeof FeedListResponseSchema>;
