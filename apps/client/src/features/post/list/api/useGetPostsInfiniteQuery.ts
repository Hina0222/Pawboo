import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { postQueryKeys } from '@/entities/post/model/post.query-key';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import type { PostListResponse, PostQuery } from '@pawboo/schemas/post';

export const getPosts = async (
  params?: Pick<PostQuery, 'cursor' | 'missionId'>
): Promise<PostListResponse> => {
  return apiClient.get<PostListResponse>(API_ROUTES.POSTS.GET_POSTS.URL, { params });
};

export const getPostsInfiniteQueryOptions = (missionId?: number) => {
  return {
    queryKey: postQueryKeys.list({ missionId }),
    queryFn: ({ pageParam = 0 }: { pageParam: number }) =>
      getPosts({ missionId, cursor: pageParam || undefined }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: PostListResponse) =>
      lastPage.hasNext ? lastPage.cursor : undefined,
  };
};

export const useGetPostsSuspenseInfiniteQuery = (missionId?: number) => {
  return useSuspenseInfiniteQuery(getPostsInfiniteQueryOptions(missionId));
};
