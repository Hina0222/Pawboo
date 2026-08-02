'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageEditorFormSchema, type ImageEditorFormValues } from '@/features/image-canvas';
import { useCreatePostMutation } from '../api/useCreatePostMutation';
import { useRouter } from '@/app/i18n/navigation';

export const useCreatePostForm = () => {
  const router = useRouter();
  const { mutate, isPending } = useCreatePostMutation();

  const methods = useForm<ImageEditorFormValues>({
    resolver: zodResolver(ImageEditorFormSchema),
    defaultValues: {
      images: [],
    },
  });

  const onSubmit = methods.handleSubmit((data: ImageEditorFormValues) => {
    mutate(data, {
      onSuccess: () => {
        router.push('/');
      },
    });
  });

  return { methods, onSubmit, isPending };
};
