'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageEditorFormSchema, type ImageEditorFormValues } from '@/features/image-canvas';
import { useSubmitMissionMutation } from '@/features/mission/submit/api/useSubmitMissionMutation';
import { useRouter } from '@/app/i18n/navigation';

export const useSubmitMissionForm = (missionId: number) => {
  const router = useRouter();
  const { mutate, isPending } = useSubmitMissionMutation();

  const methods = useForm<ImageEditorFormValues>({
    resolver: zodResolver(ImageEditorFormSchema),
    defaultValues: {
      images: [],
    },
  });

  const onSubmit = methods.handleSubmit((data: ImageEditorFormValues) => {
    mutate(
      { missionId, values: data },
      {
        onSuccess: () => {
          router.push('/mission');
        },
      }
    );
  });

  return { methods, onSubmit, isPending };
};
