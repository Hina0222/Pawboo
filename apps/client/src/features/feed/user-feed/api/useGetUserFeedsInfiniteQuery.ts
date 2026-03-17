import { useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { userQueryKeys } from '@/entities/user/model/user.query-key';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import type { FeedListResponse } from '@bragram/schemas/feed';

export const getUserFeeds = async (userId: number, cursor?: number): Promise<FeedListResponse> => {
  return apiClient.get<FeedListResponse>(API_ROUTES.USERS.GET_USER_FEEDS.URL(userId), {
    params: { cursor },
  });
};

export const getUserFeedsInfiniteQueryOptions = (userId: number) => {
  return {
    queryKey: userQueryKeys.feeds(userId),
    queryFn: ({ pageParam = 0 }: { pageParam: number }) =>
      getUserFeeds(userId, pageParam || undefined),
    initialPageParam: 0,
    getNextPageParam: (lastPage: FeedListResponse) =>
      lastPage.hasNext ? lastPage.cursor : undefined,
  };
};

export const useGetUserFeedsInfiniteQuery = (userId: number) => {
  return useInfiniteQuery(getUserFeedsInfiniteQueryOptions(userId));
};

export const useGetUserFeedsSuspenseInfiniteQuery = (userId: number) => {
  return useSuspenseInfiniteQuery(getUserFeedsInfiniteQueryOptions(userId));
};
