'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreatePostFormSchema, type CreatePostFormValues } from '../model/schema';
import { useCreatePostMutation } from '../api/useCreatePostMutation';
import { useRouter } from '@/app/i18n/navigation';

export const useCreatePostForm = () => {
  const router = useRouter();
  const { mutate, isPending } = useCreatePostMutation();

  const methods = useForm<CreatePostFormValues>({
    resolver: zodResolver(CreatePostFormSchema),
    defaultValues: {
      images: [],
    },
  });

  const onSubmit = methods.handleSubmit((data: CreatePostFormValues) => {
    mutate(data, {
      onSuccess: () => {
        router.push('/');
      },
    });
  });

  return { methods, onSubmit, isPending };
};
