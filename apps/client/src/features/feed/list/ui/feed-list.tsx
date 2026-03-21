'use client';

import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import type { FeedQuery } from '@bragram/schemas/feed';
import { useGetFeedsSuspenseInfiniteQuery } from '@/features/feed/list/api/useGetFeedsInfiniteQuery';
import { FeedItem, FeedListSkeleton, FeedListError } from '@/features/feed/list/ui';

interface FeedListProps {
  sort?: FeedQuery['sort'];
}

function FeedList({ sort = 'latest' }: FeedListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetFeedsSuspenseInfiniteQuery(sort);

  const { ref, inView } = useInView();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const feeds = data.pages.flatMap(page => page.data);

  const virtualizer = useWindowVirtualizer({
    count: feeds.length + (hasNextPage ? 1 : 0),
    estimateSize: index => (index === feeds.length ? 40 : 574),
    overscan: 3,
    measureElement: el => el.getBoundingClientRect().height,
  });

  if (feeds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-sm">아직 피드가 없습니다.</p>
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      className="px-4 pt-4"
      style={{ position: 'relative', height: virtualizer.getTotalSize() }}
    >
      {virtualizer.getVirtualItems().map(virtualRow => (
        <div
          key={virtualRow.key}
          data-index={virtualRow.index}
          ref={virtualizer.measureElement}
          className="pb-6"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
          }}
        >
          {virtualRow.index < feeds.length ? (
            <FeedItem item={feeds[virtualRow.index]} />
          ) : (
            <div ref={ref} className="flex justify-center py-4">
              {isFetchingNextPage && (
                <p className="text-xs text-muted-foreground">불러오는 중...</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default withErrorBoundary(withSuspense(FeedList, <FeedListSkeleton />), FeedListError);
