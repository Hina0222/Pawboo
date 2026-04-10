'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { useTranslations } from 'next-intl';
import { useGetUserFeedsSuspenseInfiniteQuery } from '../api/useGetUserFeedsInfiniteQuery';
import { UserFeedGridSkeleton } from './user-feed-grid-skeleton';
import { UserFeedGridError } from '@/features/feed/user-feed/ui';
import { Link } from '@/app/i18n/navigation';

interface UserFeedGridProps {
  userId: number;
}

function UserFeedGrid({ userId }: UserFeedGridProps) {
  const t = useTranslations('feed');
  const tc = useTranslations('common');
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
        <p className="text-sm">{t('noFeeds')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-0.5">
        {feeds.map(item => (
          <Link key={item.id} href={`/feed/${item.id}`}>
            <div className="relative aspect-square overflow-hidden bg-card">
              <img
                src={item.imageUrls[0]}
                alt={item.pet.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </Link>
        ))}
      </div>
      <div ref={ref} className="flex justify-center py-4">
        {isFetchingNextPage && <p className="text-xs text-muted-foreground">{tc('loading')}</p>}
      </div>
    </div>
  );
}

export default withErrorBoundary(
  withSuspense(UserFeedGrid, <UserFeedGridSkeleton />),
  UserFeedGridError
);
