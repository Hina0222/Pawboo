import { z } from 'zod';

export const CreatePostFormSchema = z.object({
  images: z
    .array(z.instanceof(File))
    .min(1, '이미지를 1장 이상 업로드해주세요.')
    .max(5, '이미지는 최대 5장까지 업로드 가능합니다.'),
});

export type CreatePostFormValues = z.infer<typeof CreatePostFormSchema>;
