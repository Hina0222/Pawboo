'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, getQueryClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { postQueryKeys } from '@/entities/post/model/post.query-key';
import { toast } from 'sonner';

export const deletePost = async (postId: number): Promise<void> => {
  return apiClient.delete<void>(API_ROUTES.POSTS.DELETE_POST.URL(postId));
};

export const useDeletePostMutation = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success('포스트를 삭제했습니다.');
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
