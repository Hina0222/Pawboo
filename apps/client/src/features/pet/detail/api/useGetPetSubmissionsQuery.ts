import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { petQueryKeys } from '@/entities/pet/model/pet.query-key';
import type { PetSubmissionHistoryResponse } from '@pawboo/schemas/mission';

export const getPetSubmissions = async (
  userId: number,
  petId: number,
  cursor?: number
): Promise<PetSubmissionHistoryResponse> => {
  return apiClient.get<PetSubmissionHistoryResponse>(
    API_ROUTES.USERS.GET_PET_SUBMISSIONS.URL(userId, petId),
    { params: { cursor } }
  );
};

export const getPetSubmissionsInfiniteQueryOptions = (userId: number, petId: number) => {
  return {
    queryKey: petQueryKeys.submissions(userId, petId),
    queryFn: ({ pageParam = 0 }: { pageParam: number }) =>
      getPetSubmissions(userId, petId, pageParam || undefined),
    initialPageParam: 0,
    getNextPageParam: (lastPage: PetSubmissionHistoryResponse) =>
      lastPage.hasNext ? (lastPage.cursor ?? undefined) : undefined,
  };
};

export const useGetPetSubmissionsSuspenseInfiniteQuery = (userId: number, petId: number) => {
  return useSuspenseInfiniteQuery(getPetSubmissionsInfiniteQueryOptions(userId, petId));
};
