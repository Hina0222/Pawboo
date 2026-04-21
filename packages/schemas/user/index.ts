import {z} from 'zod';

export const MeResponseSchema = z.object({
  id: z.number(),
  kakaoId: z.string(),
  createdAt: z.date(),
});

export type MeResponse = z.infer<typeof MeResponseSchema>;
