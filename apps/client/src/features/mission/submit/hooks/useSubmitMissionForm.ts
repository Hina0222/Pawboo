'use client';

import { useSubmitMissionMutation } from '@/features/mission/submit/api/useSubmitMissionMutation';
import { useRouter } from '@/app/i18n/navigation';

export const useSubmitMissionForm = (missionId: number) => {
  const router = useRouter();
  const { mutate, isPending } = useSubmitMissionMutation();

  const onSubmit = (images: File[]) => {
    mutate(
      { missionId, images },
      {
        onSuccess: () => {
          router.push('/mission');
        },
      }
    );
  };

  return { onSubmit, isPending };
};
