import { useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { userQueryKeys } from '@/entities/user/model/user.query-key';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import type { SearchResponse, SearchType } from '@pawboo/schemas/user';

export const searchUsers = async (
  q: string,
  type: SearchType,
  cursor?: number
): Promise<SearchResponse> => {
  return apiClient.get<SearchResponse>(API_ROUTES.USERS.SEARCH.URL, {
    params: { q, type, cursor, limit: 20 },
  });
};

export const getSearchUsersInfiniteQueryOptions = (q: string, type: SearchType) => ({
  queryKey: userQueryKeys.search(q, type),
  queryFn: ({ pageParam = 0 }: { pageParam: number }) =>
    searchUsers(q, type, pageParam || undefined),
  initialPageParam: 0,
  getNextPageParam: (lastPage: SearchResponse) => (lastPage.hasNext ? lastPage.cursor : undefined),
});

export const useSearchUsersInfiniteQuery = (q: string, type: SearchType) => {
  return useInfiniteQuery({
    ...getSearchUsersInfiniteQueryOptions(q, type),
    enabled: q.trim().length > 0,
  });
};

export const useSearchUsersSuspenseInfiniteQuery = (q: string, type: SearchType) => {
  return useSuspenseInfiniteQuery(getSearchUsersInfiniteQueryOptions(q, type));
};
