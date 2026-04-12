'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, getQueryClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import { feedQueryKeys } from '@/entities/feed/model/feed.query-key';
import { toast } from 'sonner';

export const deleteFeed = async (feedId: number): Promise<void> => {
  return apiClient.delete<void>(API_ROUTES.FEEDS.DELETE_FEED.URL(feedId));
};

export const deleteFeedMutationOptions = () => {
  const queryClient = getQueryClient();

  return {
    mutationFn: deleteFeed,
    onSuccess: () => {
      toast.success('피드를 삭제했습니다.');
      queryClient.invalidateQueries({ queryKey: feedQueryKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  };
};

export const useDeleteFeedMutation = () => {
  return useMutation(deleteFeedMutationOptions());
};
