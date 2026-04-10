'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@/app/i18n/navigation';
import { apiClient } from '@/shared/api';
import { getQueryClient } from '@/shared/api/get-query-client';
import { API_ROUTES } from '@/shared/api/api-routes.constants';

export const logout = async () => {
  return apiClient.post(API_ROUTES.AUTH.LOGOUT.URL);
};

export function useLogoutMutation() {
  const router = useRouter();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      router.replace('/signin');
    },
  });
}
