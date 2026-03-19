'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/shared/api';
import { useAuthStore } from '@/shared/store/auth-store';
import type { MeResponse } from '@bragram/schemas/user';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    apiClient
      .get<MeResponse>('/users/me')
      .then(user => {
        setAuth(user);
        router.replace(user.nickname === null ? '/onboarding/profile' : '/');
      })
      .catch(() => {
        router.replace('/');
      });
  }, [router, setAuth]);

  return <div>로그인 처리 중...</div>;
}
