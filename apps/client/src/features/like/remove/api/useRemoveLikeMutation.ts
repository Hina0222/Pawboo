'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { toast } from 'sonner';
import type { LikeResponse } from '@pawboo/schemas/like';

export const removeLike = async (submissionId: number): Promise<LikeResponse> => {
  return apiClient.delete<LikeResponse>(API_ROUTES.FEEDS.REMOVE_LIKE.URL(submissionId));
};

export const removeLikeMutationOptions = () => {
  return {
    mutationFn: removeLike,
    onSuccess: () => {},
    onError: (error: Error) => {
      toast.error(error.message);
    },
  };
};

export const useRemoveLikeMutation = () => {
  return useMutation(removeLikeMutationOptions());
};
