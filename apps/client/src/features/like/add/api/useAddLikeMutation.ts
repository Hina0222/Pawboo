'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { toast } from 'sonner';
import type { LikeResponse } from '@bragram/schemas/like';

export const addLike = async (submissionId: number): Promise<LikeResponse> => {
  return apiClient.post<LikeResponse>(API_ROUTES.FEEDS.ADD_LIKE.URL(submissionId));
};

export const addLikeMutationOptions = () => {
  return {
    mutationFn: addLike,
    onSuccess: () => {},
    onError: (error: Error) => {
      toast.error(error.message);
    },
  };
};

export const useAddLikeMutation = () => {
  return useMutation(addLikeMutationOptions());
};
