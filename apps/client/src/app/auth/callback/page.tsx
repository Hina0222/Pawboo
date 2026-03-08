'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/shared/api';
import { useAuthStore } from '@/shared/store/auth-store';
import type { MeResponse } from '@bragram/schemas';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    if (!accessToken) return;

    apiClient
      .get<MeResponse>('/users/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(user => {
        setAuth(accessToken, user);
        router.replace('/');
      });
  }, [router, setAuth]);

  return <div>로그인 처리 중...</div>;
}
