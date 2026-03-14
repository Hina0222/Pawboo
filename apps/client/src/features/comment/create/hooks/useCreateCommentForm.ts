'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type CreateCommentFormValues } from '@/features/comment/create/model/schema';
import { useCreateCommentMutation } from '@/features/comment/create/api/useCreateCommentMutation';
import { CreateCommentSchema } from '@bragram/schemas/comment';

export const useCreateCommentForm = (submissionId: number) => {
  const { mutate, isPending } = useCreateCommentMutation(submissionId);

  const methods = useForm<CreateCommentFormValues>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = methods.handleSubmit((data: CreateCommentFormValues) => {
    mutate(data, {
      onSuccess: () => methods.reset(),
    });
  });

  return { methods, onSubmit, isPending };
};
