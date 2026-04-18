import { useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { rankingQueryKeys } from '@/entities/ranking/model/ranking.query-key';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import type { RankingListResponse, RankingQuery } from '@pawboo/schemas/ranking';

export const getRankings = async (params: {
  type: RankingQuery['type'];
  cursor: number;
}): Promise<RankingListResponse> => {
  return apiClient.get<RankingListResponse>(API_ROUTES.RANKINGS.GET_RANKINGS.URL, { params });
};

export const getRankingsInfiniteQueryOptions = (type: RankingQuery['type'] = 'all') => ({
  queryKey: rankingQueryKeys.list(type),
  queryFn: ({ pageParam = 0 }: { pageParam: number }) => getRankings({ type, cursor: pageParam }),
  initialPageParam: 0,
  getNextPageParam: (lastPage: RankingListResponse) =>
    lastPage.hasNext ? lastPage.cursor : undefined,
});

export const useGetRankingsInfiniteQuery = (type: RankingQuery['type'] = 'all') =>
  useInfiniteQuery(getRankingsInfiniteQueryOptions(type));

export const useGetRankingsSuspenseInfiniteQuery = (type: RankingQuery['type'] = 'all') =>
  useSuspenseInfiniteQuery(getRankingsInfiniteQueryOptions(type));
