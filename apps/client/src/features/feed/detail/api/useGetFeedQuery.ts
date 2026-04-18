import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { feedQueryKeys } from '@/entities/feed/model/feed.query-key';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import type { FeedItem } from '@pawboo/schemas/feed';

export const getFeed = async (id: number): Promise<FeedItem> => {
  return apiClient.get<FeedItem>(API_ROUTES.FEEDS.GET_FEED.URL(id));
};

export const getFeedQueryOptions = (id: number) => {
  return {
    queryKey: feedQueryKeys.detail(id),
    queryFn: () => getFeed(id),
  };
};

export const useGetFeedQuery = (id: number) => {
  return useQuery(getFeedQueryOptions(id));
};

export const useGetFeedSuspenseQuery = (id: number) => {
  return useSuspenseQuery(getFeedQueryOptions(id));
};
