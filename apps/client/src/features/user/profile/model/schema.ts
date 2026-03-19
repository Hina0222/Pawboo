import { ProfileUpdateSchema } from '@bragram/schemas/user';
import { z } from 'zod';

export const ProfileSetupFormSchema = ProfileUpdateSchema.extend({
  nickname: z.string().min(1, '닉네임을 입력해주세요').max(20, '20자 이하로 입력해주세요'),
  image: z.instanceof(File).optional(),
});

export type ProfileSetupFormValues = z.infer<typeof ProfileSetupFormSchema>;
