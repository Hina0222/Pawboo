'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, getQueryClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { petQueryKeys } from '@/entities/pet/model/pet.query-key';
import { toast } from 'sonner';

export const deletePet = async (id: number): Promise<void> => {
  return apiClient.delete<void>(API_ROUTES.PETS.DELETE_PET.URL(id));
};

export const deletePetMutationOptions = () => {
  const queryClient = getQueryClient();

  return {
    mutationFn: deletePet,
    onSuccess: () => {
      toast.success('반려동물을 삭제했습니다.');
      queryClient.invalidateQueries({ queryKey: petQueryKeys.details() });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  };
};

export const useDeletePetMutation = () => {
  return useMutation(deletePetMutationOptions());
};
