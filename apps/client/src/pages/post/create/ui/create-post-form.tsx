'use client';

import { useCreatePostForm } from '@/features/post/create';
import { ImageEditorForm } from '@/features/image-canvas';

export const CreatePostForm = () => {
  const { methods, onSubmit, isPending } = useCreatePostForm();

  return (
    <ImageEditorForm
      methods={methods}
      onSubmit={onSubmit}
      isPending={isPending}
      submitLabel="완료"
    />
  );
};
