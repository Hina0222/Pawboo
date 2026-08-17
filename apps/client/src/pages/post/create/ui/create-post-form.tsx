'use client';

import { useCreatePostForm } from '@/features/post/create';
import { ImageEditorForm } from '@/widgets/image-editor';

export const CreatePostForm = () => {
  const { onSubmit, isPending } = useCreatePostForm();

  return <ImageEditorForm onSubmit={onSubmit} isPending={isPending} submitLabel="완료" />;
};
