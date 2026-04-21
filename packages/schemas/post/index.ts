import {z} from 'zod';

export const PostResponseSchema = z.object({
  id: z.number(),
  petId: z.number(),
  type: z.enum(['general', 'mission']),
  missionId: z.number().nullable(),
  imageUrls: z.array(z.string()),
  createdAt: z.date(),
});

export const PostQuerySchema = z.object({
  cursor: z.coerce.number().int().positive().optional(),
  missionId: z.coerce.number().int().positive().optional(),
});

export const PostItemSchema = z.object({
  id: z.number(),
  type: z.enum(['general', 'mission']),
  missionId: z.number().nullable(),
  imageUrls: z.array(z.string()),
  createdAt: z.string(),
  pet: z.object({
    id: z.number(),
    name: z.string(),
    imageUrl: z.string().nullable(),
  }),
  likeCount: z.number(),
  isLiked: z.boolean(),
});

export const PostListResponseSchema = z.object({
  data: z.array(PostItemSchema),
  hasNext: z.boolean(),
  cursor: z.number().nullable(),
});

export type PostResponse = z.infer<typeof PostResponseSchema>;
export type PostQuery = z.infer<typeof PostQuerySchema>;
export type PostItem = z.infer<typeof PostItemSchema>;
export type PostListResponse = z.infer<typeof PostListResponseSchema>;
