'use client';

import { useCreatePostMutation } from '../api/useCreatePostMutation';
import { useRouter } from '@/app/i18n/navigation';

export const useCreatePostForm = () => {
  const router = useRouter();
  const { mutate, isPending } = useCreatePostMutation();

  const onSubmit = (images: File[]) => {
    mutate(images, {
      onSuccess: () => {
        router.push('/');
      },
    });
  };

  return { onSubmit, isPending };
};
