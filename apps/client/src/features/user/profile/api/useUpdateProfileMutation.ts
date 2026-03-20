'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import { getQueryClient } from '@/shared/api/get-query-client';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { userQueryKeys } from '@/entities/user/model/user.query-key';
import type { ProfileUpdateRequest, MeResponse } from '@bragram/schemas/user';
import { toast } from 'sonner';

type UpdateProfileParams = ProfileUpdateRequest & { image?: File };

const updateProfile = async ({ nickname, image }: UpdateProfileParams): Promise<MeResponse> => {
  const formData = new FormData();
  if (nickname) formData.append('nickname', nickname);
  if (image) formData.append('image', image);

  return apiClient.patch<MeResponse>(API_ROUTES.USERS.UPDATE_ME.URL, formData);
};

export const updateProfileMutationOptions = () => {
  const queryClient = getQueryClient();

  return {
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.me() });
      toast.success('프로필이 업데이트되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  };
};

export const useUpdateProfileMutation = () => {
  return useMutation(updateProfileMutationOptions());
};
