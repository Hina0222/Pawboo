import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { petQueryKeys } from '@/entities/pet/model/pet.query-key';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import type { PetResponse } from '@pawboo/schemas/pet';

export const getPets = async (): Promise<PetResponse[]> => {
  return apiClient.get<PetResponse[]>(API_ROUTES.PETS.GET_PETS.URL);
};

export const getPetsQueryOptions = () => {
  return {
    queryKey: petQueryKeys.details(),
    queryFn: () => getPets(),
  };
};

export const useGetPetsQuery = () => {
  return useQuery(getPetsQueryOptions());
};

export const useGetPetsSuspenseQuery = () => {
  return useSuspenseQuery(getPetsQueryOptions());
};
