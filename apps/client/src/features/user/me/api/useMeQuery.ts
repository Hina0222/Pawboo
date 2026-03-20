'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import { userQueryKeys } from '@/entities/user/model/user.query-key';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import type { MeResponse } from '@bragram/schemas/user';

export const getMe = async (): Promise<MeResponse> => {
  return apiClient.get<MeResponse>(API_ROUTES.USERS.GET_ME.URL);
};

export function getMeQueryOptions() {
  return queryOptions({
    queryKey: userQueryKeys.me(),
    queryFn: getMe,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });
}

export function useMeQuery() {
  return useQuery(getMeQueryOptions());
}
