'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, getQueryClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { petQueryKeys } from '@/entities/pet/model/pet.query-key';
import { toast } from 'sonner';
import type { PetResponse } from '@pawboo/schemas/pet';
import { missionQueryKeys } from '@/entities/mission/model/mission.query-key';

export const activatePet = async (id: number): Promise<PetResponse> => {
  return apiClient.patch<PetResponse>(API_ROUTES.PETS.ACTIVATE_PET.URL(id));
};

export const activatePetMutationOptions = () => {
  const queryClient = getQueryClient();

  return {
    mutationFn: activatePet,
    onSuccess: () => {
      toast.success('반려동물을 활성화했습니다.');
      queryClient.invalidateQueries({ queryKey: petQueryKeys.details() });
      queryClient.invalidateQueries({ queryKey: missionQueryKeys.today() });
      queryClient.invalidateQueries({ queryKey: missionQueryKeys.history() });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  };
};

export const useActivatePetMutation = () => {
  return useMutation(activatePetMutationOptions());
};
