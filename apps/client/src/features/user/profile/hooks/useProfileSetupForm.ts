'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@/app/i18n/navigation';
import { useUpdateProfileMutation } from '@/features/user/profile/api/useUpdateProfileMutation';
import {
  ProfileSetupFormSchema,
  type ProfileSetupFormValues,
} from '@/features/user/profile/model/schema';
import { apiClient } from '@/shared/api/api-client';

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
      onSuccess: async () => {
        await apiClient.post('/auth/refresh');
        router.push('/onboarding/pet');
      },
      onError: (error: Error) => {
        if (error.message === '이미 사용 중인 닉네임입니다.') {
          methods.setError('nickname', { message: error.message });
        }
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
