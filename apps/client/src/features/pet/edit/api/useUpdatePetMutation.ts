'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, getQueryClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { petQueryKeys } from '@/entities/pet/model/pet.query-key';
import { type PetResponse, UpdatePetRequest } from '@bragram/schemas/pet';
import { toast } from 'sonner';

type UpdatePetParams = UpdatePetRequest & { id: number; image?: File };

export const updatePet = async ({ id, image, ...data }: UpdatePetParams): Promise<PetResponse> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== '') formData.append(key, value);
  });
  if (image) formData.append('image', image);

  return apiClient.patch<PetResponse>(API_ROUTES.PETS.UPDATE_PET.URL(id), formData);
};

export const updatePetMutationOptions = () => {
  const queryClient = getQueryClient();

  return {
    mutationFn: updatePet,
    onSuccess: () => {
      toast.success('반려동물을 업데이트했습니다.');
      queryClient.invalidateQueries({ queryKey: petQueryKeys.details() });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  };
};

export const useUpdatePetMutation = () => {
  return useMutation(updatePetMutationOptions());
};
