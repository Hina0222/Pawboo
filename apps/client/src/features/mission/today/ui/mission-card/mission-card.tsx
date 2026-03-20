'use client';

import { CheckCircle2, ImageOff, Star } from 'lucide-react';
import Link from 'next/link';
import { useGetTodayMissionSuspenseQuery } from '@/features/mission/today/api/useGetTodayMissionQuery';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { MissionCardError, MissionCardSkeleton } from '@/features/mission/today/ui/mission-card';

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
    <section className="relative overflow-hidden rounded-2xl bg-primary p-6 shadow-sm">
      <div className="relative z-10 flex flex-col gap-4">
        {/* 헤더 뱃지 */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-white/20 px-2 py-1 text-[10px] font-bold tracking-wider text-primary-foreground uppercase">
            TODAY&#39;S MISSION
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-primary-foreground">
            <Star size={11} fill="currentColor" />
            {mission.baseScore}점
          </span>
          {isDone && (
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-primary-foreground">
              <CheckCircle2 size={11} />
              완료
            </span>
          )}
        </div>

        {/* 예시 이미지 */}
        {mission.exampleImageUrl && (
          <div className="relative h-40 w-full overflow-hidden rounded-xl">
            <img
              src={mission.exampleImageUrl}
              alt="미션 예시 이미지"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {isDone && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-primary">
                  <CheckCircle2 size={16} />
                  완료
                </div>
              </div>
            )}
          </div>
        )}

        {/* 미션 내용 */}
        <div>
          <h2 className="text-xl leading-tight font-bold text-primary-foreground">
            {mission.title}
          </h2>
          <p className="mt-1 text-sm text-primary-foreground/80">{mission.description}</p>
        </div>

        {/* 참여 버튼 */}
        {!isDone && (
          <Link
            href={`/mission/${mission.id}/upload`}
            className="self-start rounded-lg bg-primary-foreground px-5 py-2.5 text-sm font-bold text-primary transition-transform active:scale-95"
          >
            참여하기
          </Link>
        )}
      </div>

      {/* 장식 요소 */}
      <div className="absolute -right-4 -bottom-4 text-[120px] font-bold text-primary-foreground/10 select-none">
        ✦
      </div>
    </section>
  );
}

export default withErrorBoundary(
  withSuspense(MissionCard, <MissionCardSkeleton />),
  MissionCardError
);
