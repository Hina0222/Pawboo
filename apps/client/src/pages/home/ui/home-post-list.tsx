'use client';

import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { PostGridList, PostGridSkeleton, PostGridError } from '@/features/post/list/ui';
import { useGetPostsSuspenseInfiniteQuery } from '@/features/post/list/api/useGetPostsInfiniteQuery';

function HomePostList() {
  const { data, fetchNextPage, hasNextPage } = useGetPostsSuspenseInfiniteQuery();
  return <PostGridList data={data} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} />;
}

export default withErrorBoundary(withSuspense(HomePostList, <PostGridSkeleton />), PostGridError);
