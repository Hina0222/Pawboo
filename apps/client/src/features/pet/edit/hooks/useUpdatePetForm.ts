'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdatePetMutation } from '@/features/pet/edit/api/useUpdatePetMutation';
import { UpdatePetFormSchema, UpdatePetFormValues } from '@/features/pet/edit/model/schema';
import type { PetResponse } from '@pawboo/schemas/pet';

export function useUpdatePetForm(pet: PetResponse, onSuccess: () => void) {
  const { mutate, isPending } = useUpdatePetMutation();

  const methods = useForm<UpdatePetFormValues>({
    resolver: zodResolver(UpdatePetFormSchema),
    defaultValues: {
      name: pet.name,
      breed: pet.breed ?? '',
      birthDate: pet.birthDate ?? '',
      bio: pet.bio ?? '',
      gender: pet.gender ?? undefined,
    },
  });

  const onSubmit = methods.handleSubmit((data: UpdatePetFormValues) => {
    mutate({ id: pet.id, ...data }, { onSuccess });
  });

  return { methods, onSubmit, isPending };
}
