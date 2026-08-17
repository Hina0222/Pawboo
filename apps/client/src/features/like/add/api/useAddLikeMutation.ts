'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, getQueryClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { patchLikeInCaches } from '@/features/like/lib/patch-like-cache';
import { postQueryKeys } from '@/entities/post/model/post.query-key';
import { toast } from 'sonner';
import type { LikeResponse } from '@pawboo/schemas/like';

export const addLike = async (submissionId: number): Promise<LikeResponse> => {
  return apiClient.post<LikeResponse>(API_ROUTES.POSTS.ADD_LIKE.URL(submissionId));
};

export const addLikeMutationOptions = () => {
  return {
    mutationFn: addLike,
    onSuccess: (data: LikeResponse, submissionId: number) => {
      patchLikeInCaches(submissionId, data);
      getQueryClient().invalidateQueries({ queryKey: postQueryKeys.liked() });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  };
};

export const useAddLikeMutation = () => {
  return useMutation(addLikeMutationOptions());
};
