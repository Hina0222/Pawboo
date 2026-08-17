'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, getQueryClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { missionQueryKeys } from '@/entities/mission/model/mission.query-key';
import { postQueryKeys } from '@/entities/post/model/post.query-key';
import { toast } from 'sonner';
import type { PostResponse } from '@pawboo/schemas/post';
import type { ImageEditorFormValues } from '@/features/image-canvas';

export const submitMission = async ({
  missionId,
  values,
}: {
  missionId: number;
  values: ImageEditorFormValues;
}): Promise<PostResponse> => {
  const formData = new FormData();
  formData.append('images', values.images[0]);
  return apiClient.post<PostResponse>(API_ROUTES.MISSIONS.SUBMIT.URL(missionId), formData);
};

export const useSubmitMissionMutation = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: submitMission,
    onSuccess: () => {
      toast.success('미션을 제출했습니다!');
      queryClient.invalidateQueries({ queryKey: missionQueryKeys.today() });
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
