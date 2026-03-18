'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, getQueryClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { missionQueryKeys } from '@/entities/mission/model/mission.query-key';
import { toast } from 'sonner';
import type { SubmissionResponse } from '@bragram/schemas/mission';
import type { SubmitMissionFormValues } from '../model/schema';

export const submitMission = async ({
  missionId,
  values,
}: {
  missionId: number;
  values: SubmitMissionFormValues;
}): Promise<SubmissionResponse> => {
  const formData = new FormData();
  values.images.forEach(file => formData.append('images', file));
  if (values.comment) formData.append('comment', values.comment);
  if (values.hashtags) formData.append('hashtags', JSON.stringify(values.hashtags));

  return apiClient.post<SubmissionResponse>(API_ROUTES.MISSIONS.SUBMIT.URL(missionId), formData);
};

export const submitMissionMutationOptions = () => {
  const queryClient = getQueryClient();

  return {
    mutationFn: submitMission,
    onSuccess: () => {
      toast.success('미션을 제출했습니다!');
      queryClient.invalidateQueries({ queryKey: missionQueryKeys.today() });
      queryClient.invalidateQueries({ queryKey: missionQueryKeys.history() });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  };
};

export const useSubmitMissionMutation = () => {
  return useMutation(submitMissionMutationOptions());
};
