import {z} from 'zod';

export const CreateSubmissionSchema = z.object({
  comment: z.string().max(150).optional(),
});

export type CreateSubmissionRequest = z.infer<typeof CreateSubmissionSchema>;

export const MissionResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  scheduledAt: z.string(),
  createdAt: z.date(),
});

export const TodayMissionResponseSchema = z.object({
  mission: MissionResponseSchema.nullable(),
  submitted: z.boolean(),
});

export const SubmissionResponseSchema = z.object({
  id: z.number(),
  missionId: z.number(),
  imageUrls: z.array(z.string()),
  comment: z.string().optional().nullable(),
  hashtags: z.array(z.string()).optional(),
  createdAt: z.string(),
});

export const SubmissionHistoryResponseSchema = z.object({
  data: z.array(SubmissionResponseSchema),
  hasNext: z.boolean(),
  cursor: z.number().nullable(),
});

export type MissionResponse = z.infer<typeof MissionResponseSchema>;
export type TodayMissionResponse = z.infer<typeof TodayMissionResponseSchema>;
export type SubmissionResponse = z.infer<typeof SubmissionResponseSchema>;
export type SubmissionHistoryResponse = z.infer<typeof SubmissionHistoryResponseSchema>;
