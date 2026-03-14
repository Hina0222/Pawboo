import {z} from 'zod';

export const CreateCommentSchema = z.object({
  content: z.string().trim().min(1).max(300),
});

export const CommentItemSchema = z.object({
  id: z.number(),
  content: z.string(),
  createdAt: z.string(),
  author: z.object({nickname: z.string(), profileImage: z.string().nullable()}),
});

export const CommentListResponseSchema = z.object({
  data: z.array(CommentItemSchema),
  hasNext: z.boolean(),
  cursor: z.number().nullable(),
});

export type CreateCommentRequest = z.infer<typeof CreateCommentSchema>;
export type CommentItem = z.infer<typeof CommentItemSchema>;
export type CommentListResponse = z.infer<typeof CommentListResponseSchema>;
