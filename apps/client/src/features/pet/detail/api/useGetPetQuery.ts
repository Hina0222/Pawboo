'use client';

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { petQueryKeys } from '@/entities/pet/model/pet.query-key';
import type { PetResponse } from '@bragram/schemas/pet';

export const getPet = async (id: number): Promise<PetResponse> => {
  return apiClient.get<PetResponse>(API_ROUTES.PETS.GET_PET.URL(id));
};

export const getPetQueryOptions = (id: number) => {
  return {
    queryKey: petQueryKeys.detail(id),
    queryFn: () => getPet(id),
  };
};

export const useGetPetQuery = (id: number) => {
  return useQuery(getPetQueryOptions(id));
};

export const useGetPetSuspenseQuery = (id: number) => {
  return useSuspenseQuery(getPetQueryOptions(id));
};
