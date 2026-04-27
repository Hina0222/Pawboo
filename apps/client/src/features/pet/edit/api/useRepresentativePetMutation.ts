'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, getQueryClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { petQueryKeys } from '@/entities/pet/model/pet.query-key';
import { toast } from 'sonner';
import type { PetResponse } from '@pawboo/schemas/pet';
import { missionQueryKeys } from '@/entities/mission/model/mission.query-key';

export const representativePet = async (id: number): Promise<PetResponse> => {
  return apiClient.patch<PetResponse>(API_ROUTES.PETS.REPRESENTATIVE_PET.URL(id));
};

export const representativePetMutationOptions = () => {
  const queryClient = getQueryClient();

  return {
    mutationFn: representativePet,
    onSuccess: () => {
      toast.success('대표 반려동물로 설정했습니다.');
      queryClient.invalidateQueries({ queryKey: petQueryKeys.details() });
      queryClient.invalidateQueries({ queryKey: missionQueryKeys.today() });
      queryClient.invalidateQueries({ queryKey: missionQueryKeys.history() });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  };
};

export const useRepresentativePetMutation = () => {
  return useMutation(representativePetMutationOptions());
};
