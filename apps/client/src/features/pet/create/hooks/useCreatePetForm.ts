'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@/app/i18n/navigation';
import { useCreatePetMutation } from '@/features/pet/create/api/useCreatePetMutation';
import { CreatePetFormSchema, CreatePetFormValues } from '@/features/pet/create/model/schema';

export function useCreatePetForm() {
  const router = useRouter();
  const { mutate, isPending } = useCreatePetMutation();

  const methods = useForm<CreatePetFormValues>({
    resolver: zodResolver(CreatePetFormSchema),
    defaultValues: { name: '' },
  });

  const onSubmit = methods.handleSubmit((data: CreatePetFormValues) => {
    mutate(data, { onSuccess: () => router.back() });
  });

  return { methods, onSubmit, isPending };
}
