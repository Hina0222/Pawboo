'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useGetMissionHistorySuspenseInfiniteQuery } from '@/features/mission/history/api/useGetMissionHistoryInfiniteQuery';
import {
  MissionHistoryError,
  MissionHistorySkeleton,
  HistoryItem,
} from '@/features/mission/history/ui';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { useInView } from 'react-intersection-observer';

function MissionHistory() {
  const t = useTranslations('mission');
  const tc = useTranslations('common');
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useGetMissionHistorySuspenseInfiniteQuery();
  const { ref, inView } = useInView();

  const histories = data.pages.flatMap(page => page.data);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (histories.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
        <p className="text-sm">{t('noHistory')}</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-6">
      {histories.map(submission => (
        <HistoryItem key={submission.id} submission={submission} />
      ))}
      <div ref={ref} className="py-2">
        {isFetchingNextPage && (
          <p className="text-center text-xs text-muted-foreground">{tc('loading')}</p>
        )}
      </div>
    </div>
  );
}

export default withErrorBoundary(
  withSuspense(MissionHistory, <MissionHistorySkeleton />),
  MissionHistoryError
);
