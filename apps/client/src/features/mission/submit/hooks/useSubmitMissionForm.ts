'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SubmitMissionFormSchema,
  type SubmitMissionFormValues,
} from '@/features/mission/submit/model/schema';
import { useSubmitMissionMutation } from '@/features/mission/submit/api/useSubmitMissionMutation';
import { useRouter } from '@/app/i18n/navigation';

export const useSubmitMissionForm = () => {
  const router = useRouter();
  const { mutate, isPending } = useSubmitMissionMutation();

  const methods = useForm<SubmitMissionFormValues>({
    resolver: zodResolver(SubmitMissionFormSchema),
    defaultValues: {
      images: [],
    },
  });

  const onSubmit = (missionId: number) =>
    methods.handleSubmit((data: SubmitMissionFormValues) => {
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
