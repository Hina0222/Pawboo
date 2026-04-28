'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, getQueryClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { postQueryKeys } from '@/entities/post/model/post.query-key';
import { toast } from 'sonner';
import type { PostResponse } from '@pawboo/schemas/post';
import type { CreatePostFormValues } from '../model/schema';

export const createPost = async (values: CreatePostFormValues): Promise<PostResponse> => {
  const formData = new FormData();
  values.images.forEach(file => formData.append('images', file));
  return apiClient.post<PostResponse>(API_ROUTES.POSTS.CREATE_POST.URL, formData);
};

export const createPostMutationOptions = () => {
  const queryClient = getQueryClient();

  return {
    mutationFn: createPost,
    onSuccess: () => {
      toast.success('게시글을 등록했습니다!');
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  };
};

export const useCreatePostMutation = () => {
  return useMutation(createPostMutationOptions());
};
