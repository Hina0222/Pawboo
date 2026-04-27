import { useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { petQueryKeys } from '@/entities/pet/model/pet.query-key';
import type { PetSearchResponse } from '@pawboo/schemas/pet';

const searchPets = async (q: string, cursor?: number): Promise<PetSearchResponse> => {
  return apiClient.get<PetSearchResponse>(API_ROUTES.PETS.SEARCH_PETS.URL, {
    params: { q, cursor },
  });
};

export const searchPetsInfiniteQueryOptions = (q: string) => ({
  queryKey: petQueryKeys.search(q),
  queryFn: ({ pageParam = 0 }: { pageParam: number }) => searchPets(q, pageParam || undefined),
  initialPageParam: 0,
  getNextPageParam: (lastPage: PetSearchResponse) =>
    lastPage.hasNext ? lastPage.cursor : undefined,
});

export const useSearchPetsInfiniteQuery = (q: string) => {
  return useInfiniteQuery({
    ...searchPetsInfiniteQueryOptions(q),
    enabled: q.trim().length > 0,
  });
};

export const useSearchPetsSuspenseInfiniteQuery = (q: string) => {
  return useSuspenseInfiniteQuery(searchPetsInfiniteQueryOptions(q));
};
