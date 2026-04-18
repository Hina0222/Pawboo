import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { missionQueryKeys } from '@/entities/mission/model/mission.query-key';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import type { TodayMissionResponse } from '@pawboo/schemas/mission';

export const getTodayMission = async (): Promise<TodayMissionResponse> => {
  return apiClient.get<TodayMissionResponse>(API_ROUTES.MISSIONS.GET_TODAY.URL);
};

export const getTodayMissionQueryOptions = () => {
  return {
    queryKey: missionQueryKeys.today(),
    queryFn: () => getTodayMission(),
  };
};

export const useGetTodayMissionQuery = () => {
  return useQuery(getTodayMissionQueryOptions());
};

export const useGetTodayMissionSuspenseQuery = () => {
  return useSuspenseQuery(getTodayMissionQueryOptions());
};
