import {z} from 'zod';

export const PetSearchItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  imageUrl: z.string().nullable(),
});

export const PetSearchResponseSchema = z.object({
  data: z.array(PetSearchItemSchema),
  hasNext: z.boolean(),
  cursor: z.number().nullable(),
});

export const PetSearchQuerySchema = z.object({
  q: z.string().min(1, '1글자 이상 입력해주세요'),
  cursor: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(30).default(20),
});

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
export type PetSearchItem = z.infer<typeof PetSearchItemSchema>;
export type PetSearchResponse = z.infer<typeof PetSearchResponseSchema>;
export type PetSearchQuery = z.infer<typeof PetSearchQuerySchema>;
