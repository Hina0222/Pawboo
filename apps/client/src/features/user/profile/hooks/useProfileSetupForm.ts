'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useUpdateProfileMutation } from '@/features/user/profile/api/useUpdateProfileMutation';
import {
  ProfileSetupFormSchema,
  type ProfileSetupFormValues,
} from '@/features/user/profile/model/schema';

export function useProfileSetupForm() {
  const router = useRouter();
  const { mutate, isPending } = useUpdateProfileMutation();

  const methods = useForm<ProfileSetupFormValues>({
    resolver: zodResolver(ProfileSetupFormSchema),
    defaultValues: {
      nickname: '',
      image: undefined,
    },
  });

  const nickname = useWatch({ control: methods.control, name: 'nickname' });

  const canSubmit = !!nickname?.trim() && !isPending;

  const onSubmit = methods.handleSubmit((data: ProfileSetupFormValues) => {
    mutate(data, {
      onSuccess: () => {
        router.push('/onboarding/pet');
      },
    });
  });

  return {
    methods,
    canSubmit,
    isPending,
    onSubmit,
  };
}
