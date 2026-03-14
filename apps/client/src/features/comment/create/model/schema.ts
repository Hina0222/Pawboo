import { z } from 'zod';
import { CreateCommentSchema } from '@bragram/schemas/comment';

export type CreateCommentFormValues = z.infer<typeof CreateCommentSchema>;
