'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SubmitMissionFormSchema,
  type SubmitMissionFormValues,
} from '@/features/mission/submit/model/schema';
import { useSubmitMissionMutation } from '@/features/mission/submit/api/useSubmitMissionMutation';

export const useSubmitMissionForm = () => {
  const { mutate, isPending } = useSubmitMissionMutation();

  const methods = useForm<SubmitMissionFormValues>({
    resolver: zodResolver(SubmitMissionFormSchema),
    defaultValues: {
      images: [],
      comment: '',
      hashtags: [],
    },
  });

  const onSubmit = (missionId: number) =>
    methods.handleSubmit((data: SubmitMissionFormValues) => {
      mutate({ missionId, values: data });
    });

  return { methods, onSubmit, isPending };
};
