'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, getQueryClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { postQueryKeys } from '@/entities/post/model/post.query-key';
import { toast } from 'sonner';
import type { PostResponse } from '@pawboo/schemas/post';

export const createPost = async (images: File[]): Promise<PostResponse> => {
  const formData = new FormData();
  images.forEach(file => formData.append('images', file));
  return apiClient.post<PostResponse>(API_ROUTES.POSTS.CREATE_POST.URL, formData);
};

export const useCreatePostMutation = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success('게시글을 등록했습니다!');
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
