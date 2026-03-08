'use client';

import { Button } from '@/shared/ui';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: () => apiClient.post('/auth/logout'),
    onSettled: () => {
      localStorage.removeItem('accessToken');
      router.replace('/signin');
    },
  });

  return (
    <div>
      <Button onClick={() => logout()} disabled={isPending}>
        Logout
      </Button>
    </div>
  );
}
