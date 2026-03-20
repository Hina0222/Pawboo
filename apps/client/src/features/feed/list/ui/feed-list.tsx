'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { useGetFeedsSuspenseInfiniteQuery } from '../api/useGetFeedsInfiniteQuery';
import { FeedItem } from './feed-item';
import { FeedListSkeleton } from './feed-list-skeleton';
import { FeedListError } from './feed-list-error';
import type { FeedQuery } from '@bragram/schemas/feed';

interface FeedListProps {
  sort?: FeedQuery['sort'];
}

function FeedList({ sort = 'latest' }: FeedListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetFeedsSuspenseInfiniteQuery(sort);

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
    <div className="flex flex-col gap-6 px-4 pt-4">
      {feeds.map(item => (
        <FeedItem key={item.id} item={item} />
      ))}
      <div ref={ref} className="flex justify-center py-4">
        {isFetchingNextPage && <p className="text-xs text-muted-foreground">불러오는 중...</p>}
      </div>
    </div>
  );
}

export default withErrorBoundary(withSuspense(FeedList, <FeedListSkeleton />), FeedListError);
