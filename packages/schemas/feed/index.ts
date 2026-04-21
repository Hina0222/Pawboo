import {z} from 'zod';

export const FeedQuerySchema = z.object({
  cursor: z.coerce.number().int().positive().optional(),
  missionId: z.coerce.number().int().positive().optional(),
});

export const FeedItemSchema = z.object({
  id: z.number(),
  type: z.enum(['general', 'mission']),
  missionId: z.number().nullable(),
  imageUrls: z.array(z.string()),
  createdAt: z.string(),
  pet: z.object({id: z.number(), name: z.string(), imageUrl: z.string().nullable()}),
  likeCount: z.number(),
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
