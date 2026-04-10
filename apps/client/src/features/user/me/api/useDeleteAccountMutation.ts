import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@/app/i18n/navigation';
import { apiClient } from '@/shared/api/api-client';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { getQueryClient } from '@/shared/api';

export const withdraw = async () => {
  return apiClient.delete(API_ROUTES.AUTH.WITHDRAW.URL);
};

export function useDeleteAccountMutation() {
  const router = useRouter();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: withdraw,
    onSettled: () => {
      queryClient.clear();
      router.replace('/signin');
    },
  });
}
