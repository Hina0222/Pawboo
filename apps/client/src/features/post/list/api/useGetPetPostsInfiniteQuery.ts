import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { postQueryKeys } from '@/entities/post/model/post.query-key';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import type { PostListResponse } from '@pawboo/schemas/post';

const getPetPosts = async (
  petId: number,
  params?: { cursor?: number }
): Promise<PostListResponse> => {
  return apiClient.get<PostListResponse>(API_ROUTES.POSTS.GET_PET_POSTS.URL(petId), { params });
};

const getPetPostsInfiniteQueryOptions = (petId: number) => ({
  queryKey: postQueryKeys.petPosts(petId),
  queryFn: ({ pageParam = 0 }: { pageParam: number }) =>
    getPetPosts(petId, { cursor: pageParam || undefined }),
  initialPageParam: 0,
  getNextPageParam: (lastPage: PostListResponse) =>
    lastPage.hasNext ? lastPage.cursor : undefined,
});

export const useGetPetPostsSuspenseInfiniteQuery = (petId: number) => {
  return useSuspenseInfiniteQuery(getPetPostsInfiniteQueryOptions(petId));
};
