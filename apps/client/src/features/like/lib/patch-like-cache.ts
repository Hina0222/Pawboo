import { getQueryClient } from '@/shared/api';
import { postQueryKeys } from '@/entities/post/model/post.query-key';
import type { LikeResponse } from '@pawboo/schemas/like';
import type { PostDetail } from '@pawboo/schemas/post';

export function patchLikeInCaches(postId: number, { likeCount, isLiked }: LikeResponse) {
  const queryClient = getQueryClient();

  queryClient.setQueryData<PostDetail>(postQueryKeys.detail(postId), old =>
    old ? { ...old, likeCount, isLiked } : old
  );
}
