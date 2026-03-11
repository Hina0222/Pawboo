'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, getQueryClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { petQueryKeys } from '@/features/pet/create/model/pet.query-key';
import type { CreatePetRequest, PetResponse } from '@bragram/schemas/pet';
import { toast } from 'sonner';

type CreatePetParams = CreatePetRequest & { image?: File };

export const createPet = async (data: CreatePetParams): Promise<PetResponse> => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('type', data.type);
  if (data.breed) formData.append('breed', data.breed);
  if (data.birthDate) formData.append('birthDate', data.birthDate);
  if (data.gender) formData.append('gender', data.gender);
  if (data.bio) formData.append('bio', data.bio);
  if (data.image) formData.append('image', data.image);

  return apiClient.post<PetResponse>(API_ROUTES.PETS.CREATE_PET.URL, formData);
};

export const createPetMutationOptions = () => {
  const queryClient = getQueryClient();

  return {
    mutationFn: createPet,
    onSuccess: () => {
      toast.success('반려동물을 저장했습니다.');
      queryClient.invalidateQueries({ queryKey: petQueryKeys.details() });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  };
};

export const useCreatePetMutation = () => {
  return useMutation(createPetMutationOptions());
};
