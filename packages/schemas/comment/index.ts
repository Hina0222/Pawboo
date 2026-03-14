import {z} from 'zod';

export const CreateCommentSchema = z.object({
  content: z.string().trim().min(1, '댓글을 입력해주세요.').max(300, '댓글은 300자 이내로 입력해주세요.'),
});

export const CommentItemSchema = z.object({
  id: z.number(),
  content: z.string(),
  createdAt: z.string(),
  author: z.object({id: z.number(), nickname: z.string(), profileImage: z.string().nullable()}),
});

export const CommentListResponseSchema = z.object({
  data: z.array(CommentItemSchema),
  hasNext: z.boolean(),
  cursor: z.number().nullable(),
});

export type CreateCommentRequest = z.infer<typeof CreateCommentSchema>;
export type CommentItem = z.infer<typeof CommentItemSchema>;
export type CommentListResponse = z.infer<typeof CommentListResponseSchema>;
