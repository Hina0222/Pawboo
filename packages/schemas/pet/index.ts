import { z } from 'zod';

export const PetTypeSchema = z.enum(['cat', 'dog']);
export const PetGenderSchema = z.enum(['male', 'female']);

export const CreatePetSchema = z.object({
  name: z.string().min(2).max(15),
  type: PetTypeSchema,
  breed: z.string().max(50).optional(),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  gender: PetGenderSchema.optional(),
  bio: z.string().max(60).optional(),
});

export const UpdatePetSchema = CreatePetSchema.partial();

export const PetResponseSchema = z.object({
  id: z.number(),
  userId: z.number(),
  name: z.string(),
  type: PetTypeSchema,
  breed: z.string().nullable(),
  birthDate: z.string().nullable(),
  gender: PetGenderSchema.nullable(),
  bio: z.string().nullable(),
  imageUrl: z.string(),
  isActive: z.boolean(),
  score: z.number(),
  weeklyScore: z.number(),
  monthlyScore: z.number(),
  createdAt: z.date(),
});

export type PetType = z.infer<typeof PetTypeSchema>;
export type PetGender = z.infer<typeof PetGenderSchema>;
export type CreatePetRequest = z.infer<typeof CreatePetSchema>;
export type UpdatePetRequest = z.infer<typeof UpdatePetSchema>;
export type PetResponse = z.infer<typeof PetResponseSchema>;
