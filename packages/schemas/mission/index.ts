import {z} from 'zod';

export const SubmissionHistoryQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.coerce.number().int().positive().optional(),
});

export const MissionResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  exampleImageUrl: z.string().nullable(),
  scheduledAt: z.string(),
  createdAt: z.date(),
});

export const PostResponseSchema = z.object({
  id: z.number(),
  petId: z.number(),
  type: z.enum(['general', 'mission']),
  missionId: z.number().nullable(),
  imageUrls: z.array(z.string()),
  createdAt: z.date(),
});

export const TodayMissionResponseSchema = z.object({
  mission: MissionResponseSchema.nullable(),
  post: PostResponseSchema.nullable(),
});

export const SubmissionHistoryResponseSchema = z.object({
  data: z.array(PostResponseSchema),
  hasNext: z.boolean(),
  cursor: z.number().nullable(),
});

export type SubmissionHistoryQuery = z.infer<typeof SubmissionHistoryQuerySchema>;
export type MissionResponse = z.infer<typeof MissionResponseSchema>;
export type PostResponse = z.infer<typeof PostResponseSchema>;
export type TodayMissionResponse = z.infer<typeof TodayMissionResponseSchema>;
export type SubmissionHistoryResponse = z.infer<typeof SubmissionHistoryResponseSchema>;
