'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useUpdateProfileMutation } from '@/features/user/profile/api/useUpdateProfileMutation';
import { useMeQuery } from '@/features/user/me/api/useMeQuery';
import {
  ProfileSetupFormSchema,
  type ProfileSetupFormValues,
} from '@/features/user/profile/model/schema';

export function useProfileUpdateForm() {
  const router = useRouter();
  const { data: user } = useMeQuery();
  const { mutate, isPending } = useUpdateProfileMutation();

  const methods = useForm<ProfileSetupFormValues>({
    resolver: zodResolver(ProfileSetupFormSchema),
    defaultValues: {
      nickname: user?.nickname ?? '',
      image: undefined,
    },
  });

  const nickname = useWatch({ control: methods.control, name: 'nickname' });

  const canSubmit = !!nickname?.trim() && !isPending;

  const onSubmit = methods.handleSubmit((data: ProfileSetupFormValues) => {
    mutate(data, {
      onSuccess: () => {
        router.back();
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
    currentProfileImage: user?.profileImage ?? null,
  };
}
