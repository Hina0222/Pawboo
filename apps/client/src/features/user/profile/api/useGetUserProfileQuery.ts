import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { userQueryKeys } from '@/entities/user/model/user.query-key';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import type { UserProfileResponse } from '@bragram/schemas/user';

export const getUserProfile = async (id: number): Promise<UserProfileResponse> => {
  return apiClient.get<UserProfileResponse>(API_ROUTES.USERS.GET_PROFILE.URL(id));
};

export const getUserProfileQueryOptions = (id: number) => {
  return {
    queryKey: userQueryKeys.profile(id),
    queryFn: () => getUserProfile(id),
  };
};

export const useGetUserProfileQuery = (id: number) => {
  return useQuery(getUserProfileQueryOptions(id));
};

export const useGetUserProfileSuspenseQuery = (id: number) => {
  return useSuspenseQuery(getUserProfileQueryOptions(id));
};
