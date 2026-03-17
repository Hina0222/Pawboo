'use client';

import { useMutation } from '@tanstack/react-query';
import { userQueryKeys } from '@/entities/user/model/user.query-key';
import { apiClient, getQueryClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { toast } from 'sonner';

export const unfollow = async (userId: number): Promise<void> => {
  return apiClient.delete<void>(API_ROUTES.USERS.UNFOLLOW.URL(userId));
};

export const unfollowMutationOptions = (userId: number) => {
  const queryClient = getQueryClient();

  return {
    mutationFn: unfollow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.profile(userId) });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  };
};

export const useUnfollowMutation = (userId: number) => {
  return useMutation(unfollowMutationOptions(userId));
};
