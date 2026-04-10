'use client';

import { useEffect } from 'react';
import { Link } from '@/app/i18n/navigation';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from '@/shared/ui';
import { useGetPetSubmissionsSuspenseInfiniteQuery } from '@/features/pet/detail/api/useGetPetSubmissionsQuery';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { useTranslations } from 'next-intl';

interface PublicPetMissionsProps {
  userId: number;
  petId: number;
}

function PublicPetMissions({ userId, petId }: PublicPetMissionsProps) {
  const t = useTranslations('pet');
  const tc = useTranslations('common');
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useGetPetSubmissionsSuspenseInfiniteQuery(userId, petId);
  const { ref, inView } = useInView();

  const submissions = data.pages.flatMap(page => page.data);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
        <p className="text-sm">{t('noMissionHistory')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-0.5">
        {submissions.map(submission => (
          <Link key={submission.id} href={`/feed/${submission.id}`}>
            <div className="relative aspect-square overflow-hidden bg-card">
              <img
                src={submission.imageUrls[0]}
                alt={submission.mission.title}
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

function PublicPetMissionsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-0.5">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square w-full" />
      ))}
    </div>
  );
}

function PublicPetMissionsError() {
  const t = useTranslations('pet');
  return (
    <div className="py-8 text-center text-sm text-muted-foreground">
      {t('missionHistoryLoadError')}
    </div>
  );
}

export default withErrorBoundary(
  withSuspense(PublicPetMissions, <PublicPetMissionsSkeleton />),
  PublicPetMissionsError
);
