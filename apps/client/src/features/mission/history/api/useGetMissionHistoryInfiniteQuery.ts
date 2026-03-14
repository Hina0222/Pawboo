import { useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { missionQueryKeys } from '@/entities/mission/model/mission.query-key';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import type { SubmissionHistoryResponse } from '@bragram/schemas/mission';

export const getMissionHistory = async (params?: {
  cursor?: number;
}): Promise<SubmissionHistoryResponse> => {
  return apiClient.get<SubmissionHistoryResponse>(API_ROUTES.MISSIONS.GET_HISTORY.URL, { params });
};

export const getMissionHistoryInfiniteQueryOptions = () => {
  return {
    queryKey: missionQueryKeys.history(),
    queryFn: ({ pageParam = 0 }: { pageParam: number }) =>
      getMissionHistory({ cursor: pageParam || undefined }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: SubmissionHistoryResponse) =>
      lastPage.hasNext ? lastPage.cursor : undefined,
  };
};

export const useGetMissionHistoryInfiniteQuery = () => {
  return useInfiniteQuery(getMissionHistoryInfiniteQueryOptions());
};

export const useGetMissionHistorySuspenseInfiniteQuery = () => {
  return useSuspenseInfiniteQuery(getMissionHistoryInfiniteQueryOptions());
};
