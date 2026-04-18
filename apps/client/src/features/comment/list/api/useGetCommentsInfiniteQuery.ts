import { useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { commentQueryKeys } from '@/entities/comment/model/comment.query-key';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import type { CommentListResponse } from '@pawboo/schemas/comment';

export const getComments = async (
  submissionId: number,
  params?: { cursor?: number; limit?: number }
): Promise<CommentListResponse> => {
  return apiClient.get<CommentListResponse>(API_ROUTES.FEEDS.GET_COMMENTS.URL(submissionId), {
    params,
  });
};

export const getCommentsInfiniteQueryOptions = (submissionId: number) => {
  return {
    queryKey: commentQueryKeys.list(submissionId),
    queryFn: ({ pageParam = 0 }: { pageParam: number }) =>
      getComments(submissionId, { cursor: pageParam || undefined }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: CommentListResponse) =>
      lastPage.hasNext ? lastPage.cursor : undefined,
  };
};

export const useGetCommentsInfiniteQuery = (submissionId: number) => {
  return useInfiniteQuery(getCommentsInfiniteQueryOptions(submissionId));
};

export const useGetCommentsSuspenseInfiniteQuery = (submissionId: number) => {
  return useSuspenseInfiniteQuery(getCommentsInfiniteQueryOptions(submissionId));
};
