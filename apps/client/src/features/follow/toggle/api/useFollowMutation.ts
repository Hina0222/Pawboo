'use client';

import { useMutation } from '@tanstack/react-query';
import { userQueryKeys } from '@/entities/user/model/user.query-key';
import { apiClient, getQueryClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { toast } from 'sonner';

export const follow = async (userId: number): Promise<void> => {
  return apiClient.post<void>(API_ROUTES.USERS.FOLLOW.URL(userId));
};

export const followMutationOptions = (userId: number) => {
  const queryClient = getQueryClient();

  return {
    mutationFn: follow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.profile(userId) });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  };
};

export const useFollowMutation = (userId: number) => {
  return useMutation(followMutationOptions(userId));
};
