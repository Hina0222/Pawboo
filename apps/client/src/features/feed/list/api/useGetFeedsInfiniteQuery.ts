import { useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { feedQueryKeys } from '@/entities/feed/model/feed.query-key';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import type { FeedListResponse, FeedQuery } from '@pawboo/schemas/feed';

export const getFeeds = async (params?: FeedQuery): Promise<FeedListResponse> => {
  return apiClient.get<FeedListResponse>(API_ROUTES.FEEDS.GET_FEEDS.URL, { params });
};

export const getFeedsInfiniteQueryOptions = (sort: FeedQuery['sort'] = 'latest') => {
  return {
    queryKey: feedQueryKeys.list({ sort }),
    queryFn: ({ pageParam = 0 }: { pageParam: number }) =>
      getFeeds({ sort, cursor: pageParam || undefined }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: FeedListResponse) =>
      lastPage.hasNext ? lastPage.cursor : undefined,
  };
};

export const useGetFeedsInfiniteQuery = (sort: FeedQuery['sort'] = 'latest') => {
  return useInfiniteQuery(getFeedsInfiniteQueryOptions(sort));
};

export const useGetFeedsSuspenseInfiniteQuery = (sort: FeedQuery['sort'] = 'latest') => {
  return useSuspenseInfiniteQuery(getFeedsInfiniteQueryOptions(sort));
};
