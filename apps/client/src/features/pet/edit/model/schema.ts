import { UpdatePetSchema } from '@pawboo/schemas/pet';
import { z } from 'zod';

export const UpdatePetFormSchema = UpdatePetSchema.extend({
  image: z.instanceof(File).optional(),
});

export type UpdatePetFormValues = z.infer<typeof UpdatePetFormSchema>;
