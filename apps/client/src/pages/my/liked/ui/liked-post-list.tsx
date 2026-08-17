'use client';

import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { PostGridList, PostGridSkeleton, PostGridError } from '@/features/post/list/ui';
import { useGetLikedPostsSuspenseInfiniteQuery } from '@/features/post/list/api/useGetLikedPostsInfiniteQuery';

function LikedPostList() {
  const { data, fetchNextPage, isFetchingNextPage, isFetchNextPageError, hasNextPage } =
    useGetLikedPostsSuspenseInfiniteQuery();
  return (
    <PostGridList
      data={data}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isFetchNextPageError={isFetchNextPageError}
      hasNextPage={hasNextPage}
    />
  );
}

export default withErrorBoundary(withSuspense(LikedPostList, <PostGridSkeleton />), PostGridError);
