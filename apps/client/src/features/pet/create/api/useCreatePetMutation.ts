'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, getQueryClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { petQueryKeys } from '@/entities/pet/model/pet.query-key';
import type { PetResponse } from '@pawboo/schemas/pet';
import type { CreatePetFormValues } from '@/features/pet/create/model/schema';
import { toast } from 'sonner';
import { missionQueryKeys } from '@/entities/mission/model/mission.query-key';

export const createPet = async ({ image, ...data }: CreatePetFormValues): Promise<PetResponse> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== '') formData.append(key, value);
  });
  if (image) formData.append('image', image);

  return apiClient.post<PetResponse>(API_ROUTES.PETS.CREATE_PET.URL, formData);
};

export const createPetMutationOptions = () => {
  const queryClient = getQueryClient();

  return {
    mutationFn: createPet,
    onSuccess: () => {
      toast.success('반려동물을 추가했습니다.');
      queryClient.invalidateQueries({ queryKey: petQueryKeys.details() });
      queryClient.invalidateQueries({ queryKey: missionQueryKeys.today() });
      queryClient.invalidateQueries({ queryKey: missionQueryKeys.history() });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  };
};

export const useCreatePetMutation = () => {
  return useMutation(createPetMutationOptions());
};
