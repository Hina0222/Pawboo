'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMeQuery } from '@/features/user/me/api/useMeQuery';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: user, isError } = useMeQuery();

  useEffect(() => {
    if (user) {
      router.replace(user.nickname === null ? '/onboarding/profile' : '/');
    }
    if (isError) {
      router.replace('/signin');
    }
  }, [user, isError, router]);

  return <div>로그인 처리 중...</div>;
}
