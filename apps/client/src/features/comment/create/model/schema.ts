import { z } from 'zod';
import { CreateCommentSchema } from '@pawboo/schemas/comment';

export type CreateCommentFormValues = z.infer<typeof CreateCommentSchema>;
