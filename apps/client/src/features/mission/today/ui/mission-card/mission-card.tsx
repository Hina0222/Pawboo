'use client';

import { CheckCircle2, ImageOff, Star } from 'lucide-react';
import { Button } from '@/shared/ui';
import { useGetTodayMissionSuspenseQuery } from '@/features/mission/today/api/useGetTodayMissionQuery';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { MissionCardError, MissionCardSkeleton } from '@/features/mission/today/ui/mission-card';
import Link from 'next/link';

function MissionCard() {
  const { data } = useGetTodayMissionSuspenseQuery();
  const { mission, submission } = data;

  const isDone = !!submission;

  if (!mission) {
    return (
      <div className="flex flex-col items-center gap-3 px-5 py-16 text-center text-muted-foreground">
        <ImageOff size={40} />
        <p className="text-sm">오늘의 미션이 아직 준비되지 않았습니다.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {mission.exampleImageUrl && (
        <div className="relative h-52 w-full">
          <img
            src={mission.exampleImageUrl}
            alt="미션 예시 이미지"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {isDone && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-[oklch(0.72_0.18_42)]">
                <CheckCircle2 size={16} />
                완료
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 rounded-full bg-[oklch(0.72_0.18_42/12%)] px-2.5 py-1 text-xs font-medium text-[oklch(0.72_0.18_42)]">
            <Star size={11} fill="currentColor" />
            {mission.baseScore}점
          </span>
          {isDone && !mission.exampleImageUrl && (
            <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600">
              <CheckCircle2 size={11} />
              완료
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-foreground">{mission.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{mission.description}</p>
        </div>

        {!isDone && (
          <Button
            asChild
            className="mt-1 h-11 w-full rounded-xl bg-[oklch(0.72_0.18_42)] font-semibold text-[oklch(0.985_0.001_106.423)] hover:bg-[oklch(0.65_0.18_42)]"
          >
            <Link href={`/mission/${mission.id}/upload`}>인증하기</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export default withErrorBoundary(
  withSuspense(MissionCard, <MissionCardSkeleton />),
  MissionCardError
);
