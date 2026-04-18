import { CreatePetSchema } from '@pawboo/schemas/pet';
import { z } from 'zod';

export const CreatePetFormSchema = CreatePetSchema.extend({
  image: z.instanceof(File).optional(),
});

export type CreatePetFormValues = z.infer<typeof CreatePetFormSchema>;
