'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, getQueryClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { patchLikeInCaches } from '@/features/like/lib/patch-like-cache';
import { postQueryKeys } from '@/entities/post/model/post.query-key';
import { toast } from 'sonner';
import type { LikeResponse } from '@pawboo/schemas/like';

export const removeLike = async (submissionId: number): Promise<LikeResponse> => {
  return apiClient.delete<LikeResponse>(API_ROUTES.POSTS.REMOVE_LIKE.URL(submissionId));
};

export const removeLikeMutationOptions = () => {
  return {
    mutationFn: removeLike,
    onSuccess: (data: LikeResponse, submissionId: number) => {
      patchLikeInCaches(submissionId, data);
      getQueryClient().invalidateQueries({ queryKey: postQueryKeys.liked() });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  };
};

export const useRemoveLikeMutation = () => {
  return useMutation(removeLikeMutationOptions());
};
