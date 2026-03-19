'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
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
  return {
    mutationFn: updateProfile,
    onSuccess: () => {
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
