import {z} from 'zod';

export const MissionResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  exampleImageUrl: z.string().nullable(),
  scheduledAt: z.string(),
  createdAt: z.date(),
});

export const TodayMissionResponseSchema = z.object({
  mission: MissionResponseSchema.nullable(),
  submitted: z.boolean(),
});

export type MissionResponse = z.infer<typeof MissionResponseSchema>;
export type TodayMissionResponse = z.infer<typeof TodayMissionResponseSchema>;
