import { useSuspenseQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { petQueryKeys } from '@/entities/pet/model/pet.query-key';
import type { PetResponse } from '@pawboo/schemas/pet';

export const getPublicPet = async (userId: number, petId: number): Promise<PetResponse> => {
  return apiClient.get<PetResponse>(API_ROUTES.USERS.GET_PUBLIC_PET.URL(userId, petId));
};

export const getPublicPetQueryOptions = (userId: number, petId: number) => {
  return {
    queryKey: petQueryKeys.publicDetail(userId, petId),
    queryFn: () => getPublicPet(userId, petId),
  };
};

export const useGetPublicPetSuspenseQuery = (userId: number, petId: number) => {
  return useSuspenseQuery(getPublicPetQueryOptions(userId, petId));
};
