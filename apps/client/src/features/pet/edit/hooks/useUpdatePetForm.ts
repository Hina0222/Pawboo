'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdatePetMutation } from '@/features/pet/edit/api/useUpdatePetMutation';
import { UpdatePetFormSchema, UpdatePetFormValues } from '@/features/pet/edit/model/schema';
import type { PetResponse } from '@pawboo/schemas/pet';
import { useRouter } from '@/app/i18n/navigation';

export function useUpdatePetForm(pet: PetResponse) {
  const { mutate, isPending } = useUpdatePetMutation();
  const router = useRouter();

  const methods = useForm<UpdatePetFormValues>({
    resolver: zodResolver(UpdatePetFormSchema),
    defaultValues: {
      name: pet.name,
    },
  });

  const onSubmit = methods.handleSubmit((data: UpdatePetFormValues) => {
    mutate({ id: pet.id, ...data }, { onSuccess: () => router.back() });
  });

  return { methods, onSubmit, isPending };
}
