'use client';

import { useEffect } from 'react';
import { Link } from '@/app/i18n/navigation';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from '@/shared/ui';
import { useGetPetSubmissionsSuspenseInfiniteQuery } from '@/features/pet/detail/api/useGetPetSubmissionsQuery';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';

interface PublicPetMissionsProps {
  userId: number;
  petId: number;
}

function PublicPetMissions({ userId, petId }: PublicPetMissionsProps) {
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
        <p className="text-sm">아직 미션 이력이 없습니다.</p>
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
        {isFetchingNextPage && <p className="text-xs text-muted-foreground">불러오는 중...</p>}
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
  return (
    <div className="py-8 text-center text-sm text-muted-foreground">
      미션 이력을 불러오는 데 실패했습니다.
    </div>
  );
}

export default withErrorBoundary(
  withSuspense(PublicPetMissions, <PublicPetMissionsSkeleton />),
  PublicPetMissionsError
);
