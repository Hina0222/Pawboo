import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { postQueryKeys } from '@/entities/post/model/post.query-key';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import type { PostDetail } from '@pawboo/schemas/post';

export const getPost = async (id: number): Promise<PostDetail> => {
  return apiClient.get<PostDetail>(API_ROUTES.POSTS.GET_POST.URL(id));
};

export const getPostQueryOptions = (id: number) => {
  return {
    queryKey: postQueryKeys.detail(id),
    queryFn: () => getPost(id),
  };
};

export const useGetPostQuery = (id: number) => {
  return useQuery(getPostQueryOptions(id));
};

export const useGetPostSuspenseQuery = (id: number) => {
  return useSuspenseQuery(getPostQueryOptions(id));
};
