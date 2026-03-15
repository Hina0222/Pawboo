import { z } from 'zod';

export const RankingQuerySchema = z.object({
  type: z.enum(['all', 'weekly', 'monthly']).default('all'),
  cursor: z.coerce.number().int().min(0).max(80).default(0),
});

export const RankingItemSchema = z.object({
  rank: z.number(),
  petId: z.number(),
  petName: z.string(),
  petType: z.string(),
  petImageUrl: z.string().nullable(),
  score: z.number(),
  ownerNickname: z.string(),
  ownerProfileImage: z.string().nullable(),
});

export const RankingListResponseSchema = z.object({
  data: z.array(RankingItemSchema),
  hasNext: z.boolean(),
  cursor: z.number().nullable(),
});

export type RankingQuery = z.infer<typeof RankingQuerySchema>;
export type RankingItem = z.infer<typeof RankingItemSchema>;
export type RankingListResponse = z.infer<typeof RankingListResponseSchema>;
