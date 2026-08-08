'use client';

import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { PostGridList, PostGridSkeleton, PostGridError } from '@/features/post/list/ui';
import { useGetPostsSuspenseInfiniteQuery } from '@/features/post/list/api/useGetPostsInfiniteQuery';
import { useGetTodayMissionSuspenseQuery } from '@/features/mission/today/api/useGetTodayMissionQuery';

function MissionPostListContent({ missionId }: { missionId: number }) {
  const { data, fetchNextPage, isFetchingNextPage, isFetchNextPageError, hasNextPage } =
    useGetPostsSuspenseInfiniteQuery(missionId);
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

function MissionPostList() {
  const {
    data: { mission },
  } = useGetTodayMissionSuspenseQuery();
  if (!mission) return null;
  return <MissionPostListContent missionId={mission.id} />;
}

export default withErrorBoundary(
  withSuspense(MissionPostList, <PostGridSkeleton />),
  PostGridError
);
