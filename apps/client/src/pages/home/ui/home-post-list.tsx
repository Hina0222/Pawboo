'use client';

import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { PostGridList, PostGridSkeleton, PostGridError } from '@/features/post/list/ui';
import { useGetPostsSuspenseInfiniteQuery } from '@/features/post/list/api/useGetPostsInfiniteQuery';

function HomePostList() {
  const { data, fetchNextPage, isFetchingNextPage, isFetchNextPageError, hasNextPage } =
    useGetPostsSuspenseInfiniteQuery();
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

export default withErrorBoundary(withSuspense(HomePostList, <PostGridSkeleton />), PostGridError);
