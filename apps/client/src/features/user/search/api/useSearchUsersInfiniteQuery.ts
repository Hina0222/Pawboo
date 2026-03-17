import { useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { userQueryKeys } from '@/entities/user/model/user.query-key';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import type { UserSearchResponse } from '@bragram/schemas/user';

export const searchUsers = async (q: string, cursor?: number): Promise<UserSearchResponse> => {
  return apiClient.get<UserSearchResponse>(API_ROUTES.USERS.SEARCH.URL, {
    params: { q, cursor, limit: 20 },
  });
};

export const getSearchUsersInfiniteQueryOptions = (q: string) => ({
  queryKey: userQueryKeys.search(q),
  queryFn: ({ pageParam = 0 }: { pageParam: number }) => searchUsers(q, pageParam || undefined),
  initialPageParam: 0,
  getNextPageParam: (lastPage: UserSearchResponse) =>
    lastPage.hasNext ? lastPage.cursor : undefined,
});

export const useSearchUsersInfiniteQuery = (q: string) => {
  return useInfiniteQuery({
    ...getSearchUsersInfiniteQueryOptions(q),
    enabled: q.trim().length > 0,
  });
};

export const useSearchUsersSuspenseInfiniteQuery = (q: string) => {
  return useSuspenseInfiniteQuery(getSearchUsersInfiniteQueryOptions(q));
};
