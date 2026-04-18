'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, getQueryClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { commentQueryKeys } from '@/entities/comment/model/comment.query-key';
import { toast } from 'sonner';
import type { CommentItem, CreateCommentRequest } from '@pawboo/schemas/comment';

export const createComment = async ({
  submissionId,
  body,
}: {
  submissionId: number;
  body: CreateCommentRequest;
}): Promise<CommentItem> => {
  return apiClient.post<CommentItem>(API_ROUTES.FEEDS.CREATE_COMMENT.URL(submissionId), body);
};

export const createCommentMutationOptions = (submissionId: number) => {
  const queryClient = getQueryClient();

  return {
    mutationFn: (body: CreateCommentRequest) => createComment({ submissionId, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.list(submissionId) });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  };
};

export const useCreateCommentMutation = (submissionId: number) => {
  return useMutation(createCommentMutationOptions(submissionId));
};
