import {z} from 'zod';

export const LikeResponseSchema = z.object({
  likeCount: z.number(),
  isLiked: z.boolean(),
});

export type LikeResponse = z.infer<typeof LikeResponseSchema>;
