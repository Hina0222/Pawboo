'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { useGetUserFeedsSuspenseInfiniteQuery } from '../api/useGetUserFeedsInfiniteQuery';
import { UserFeedGridSkeleton } from './user-feed-grid-skeleton';
import { UserFeedGridError } from '@/features/feed/user-feed/ui';

interface UserFeedGridProps {
  userId: number;
}

function UserFeedGrid({ userId }: UserFeedGridProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetUserFeedsSuspenseInfiniteQuery(userId);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const feeds = data.pages.flatMap(page => page.data);

  if (feeds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-sm">아직 피드가 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-0.5">
        {feeds.map(item => (
          <div key={item.id} className="relative aspect-square overflow-hidden bg-card">
            <Image src={item.imageUrl} alt={item.pet.name} fill className="object-cover" />
          </div>
        ))}
      </div>
      <div ref={ref} className="flex justify-center py-4">
        {isFetchingNextPage && <p className="text-xs text-muted-foreground">불러오는 중...</p>}
      </div>
    </div>
  );
}

export default withErrorBoundary(
  withSuspense(UserFeedGrid, <UserFeedGridSkeleton />),
  UserFeedGridError
);
