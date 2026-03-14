import {z} from 'zod';

export const CreateSubmissionSchema = z.object({
  comment: z.string().trim().max(150, '댓글은 150자 이하로 입력해주세요').optional(),
  hashtags: z
    .preprocess(
      (val) => {
        if (typeof val === 'string') {
          try {
            return JSON.parse(val);
          } catch {
            return val;
          }
        }
        return val;
      },
      z.array(z.string()).max(5, '해시태그는 최대 5개까지 입력할 수 있습니다'),
    )
    .optional(),
});

export const SubmissionHistoryQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.coerce.number().int().positive().optional(),
});

export const MissionResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  exampleImageUrl: z.string().nullable(),
  baseScore: z.number(),
  scheduledAt: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const SubmissionResponseSchema = z.object({
  id: z.number(),
  missionId: z.number(),
  petId: z.number(),
  imageUrl: z.string(),
  comment: z.string().nullable(),
  hashtags: z.array(z.string()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TodayMissionResponseSchema = z.object({
  mission: MissionResponseSchema.nullable(),
  submission: SubmissionResponseSchema.nullable(),
});

export const SubmissionHistoryResponseSchema = z.object({
  data: z.array(SubmissionResponseSchema),
  hasNext: z.boolean(),
  cursor: z.number().nullable(),
});

export type CreateSubmissionRequest = z.infer<typeof CreateSubmissionSchema>;
export type SubmissionHistoryQuery = z.infer<typeof SubmissionHistoryQuerySchema>;
export type MissionResponse = z.infer<typeof MissionResponseSchema>;
export type SubmissionResponse = z.infer<typeof SubmissionResponseSchema>;
export type TodayMissionResponse = z.infer<typeof TodayMissionResponseSchema>;
export type SubmissionHistoryResponse = z.infer<typeof SubmissionHistoryResponseSchema>;
