import { Skeleton } from '@/shared/ui';

function MissionHistorySkeleton() {
  return (
    <div className="relative space-y-6 px-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="relative pl-12">
          {/* 원 인디케이터 */}
          <Skeleton className="absolute top-1 left-0 size-10 rounded-full" />
          {/* 카드 */}
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="size-12 shrink-0 rounded-lg" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MissionHistorySkeleton;
