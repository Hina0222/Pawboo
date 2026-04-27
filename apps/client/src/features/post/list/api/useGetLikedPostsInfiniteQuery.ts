import { useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { postQueryKeys } from '@/entities/post/model/post.query-key';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import type { PostListResponse } from '@pawboo/schemas/post';

export const getLikedPosts = async (params?: { cursor?: number }): Promise<PostListResponse> => {
  return apiClient.get<PostListResponse>(API_ROUTES.POSTS.GET_LIKED_POSTS.URL, { params });
};

export const getLikedPostsInfiniteQueryOptions = () => {
  return {
    queryKey: postQueryKeys.liked(),
    queryFn: ({ pageParam = 0 }: { pageParam: number }) =>
      getLikedPosts({ cursor: pageParam || undefined }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: PostListResponse) =>
      lastPage.hasNext ? lastPage.cursor : undefined,
  };
};

export const useGetLikedPostsInfiniteQuery = () => {
  return useInfiniteQuery(getLikedPostsInfiniteQueryOptions());
};

export const useGetLikedPostsSuspenseInfiniteQuery = () => {
  return useSuspenseInfiniteQuery(getLikedPostsInfiniteQueryOptions());
};
