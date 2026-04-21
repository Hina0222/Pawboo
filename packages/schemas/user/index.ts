import {z} from 'zod';

export const MeResponseSchema = z.object({
  id: z.number(),
  kakaoId: z.string(),
  createdAt: z.date(),
});

export const PetSearchItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  imageUrl: z.string().nullable(),
});

export const PetSearchResponseSchema = z.object({
  data: z.array(PetSearchItemSchema),
  hasNext: z.boolean(),
  cursor: z.number().nullable(),
});

export const SearchQuerySchema = z.object({
  q: z.string().min(1, '1글자 이상 입력해주세요'),
  cursor: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(30).default(20),
});

export type MeResponse = z.infer<typeof MeResponseSchema>;
export type PetSearchItem = z.infer<typeof PetSearchItemSchema>;
export type PetSearchResponse = z.infer<typeof PetSearchResponseSchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
