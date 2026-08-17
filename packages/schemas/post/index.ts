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
});

export const PostDetailSchema = PostItemSchema.extend({
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

export const CalendarPostListResponseSchema = z.object({
  data: z.array(PostDetailSchema),
  hasNext: z.boolean(),
  cursor: z.number().nullable(),
});

export const CalendarQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'month는 YYYY-MM 형식이어야 합니다.'),
  petId: z.coerce.number().int().positive().optional(),
});

/** 캘린더 타일 1칸 = 그 날의 대표(최신) 게시물 요약 + 모달용 id 목록 */
export const CalendarDaySchema = z.object({
  date: z.string(), // KST 'YYYY-MM-DD'
  thumbnailUrl: z.string(), // 최신 글의 imageUrls[0]
  isMission: z.boolean(), // 최신 글의 type === 'mission'
  postIds: z.array(z.number()), // id DESC. 모달이 이 id로 /posts/:id 를 연다
});

export const CalendarMonthResponseSchema = z.array(CalendarDaySchema);

export type PostResponse = z.infer<typeof PostResponseSchema>;
export type PostQuery = z.infer<typeof PostQuerySchema>;
export type PostItem = z.infer<typeof PostItemSchema>;
export type PostDetail = z.infer<typeof PostDetailSchema>;
export type PostListResponse = z.infer<typeof PostListResponseSchema>;
export type CalendarPostListResponse = z.infer<typeof CalendarPostListResponseSchema>;
export type CalendarQuery = z.infer<typeof CalendarQuerySchema>;
export type CalendarDay = z.infer<typeof CalendarDaySchema>;
export type CalendarMonthResponse = z.infer<typeof CalendarMonthResponseSchema>;
