import {z} from 'zod';

export const CreatePetSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, '이름은 최소 2자 이상 입력해주세요')
    .max(15, '이름은 최대 15자까지 입력할 수 있습니다'),
});

export const UpdatePetSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, '이름은 최소 2자 이상 입력해주세요')
    .max(15, '이름은 최대 15자까지 입력할 수 있습니다')
    .optional(),
});

export const PetResponseSchema = z.object({
  id: z.number(),
  userId: z.number(),
  name: z.string(),
  imageUrl: z.string().nullable(),
  isRepresentative: z.boolean(),
  createdAt: z.date(),
});

export type CreatePetRequest = z.infer<typeof CreatePetSchema>;
export type UpdatePetRequest = z.infer<typeof UpdatePetSchema>;
export type PetResponse = z.infer<typeof PetResponseSchema>;