'use client';

import { useMutation } from '@tanstack/react-query';
import { getQueryClient } from '@/shared/api';
import { petQueryKeys } from '@/features/pet/create/model/pet.query-key';

export const createPet = async () => {};

export const createPetMutationOptions = () => {
  const queryClient = getQueryClient();

  return {
    mutationFn: createPet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petQueryKeys.details() });
    },
    onError: () => {},
  };
};

export const useCreatePetMutation = () => {
  return useMutation(createPetMutationOptions());
};
