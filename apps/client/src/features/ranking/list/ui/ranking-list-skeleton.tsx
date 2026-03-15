import { Skeleton } from '@/shared/ui';

export function RankingListSkeleton() {
  return (
    <div className="px-5">
      {/* 포디움 skeleton */}
      <div className="mb-6 flex items-end justify-center gap-3">
        {[28, 36, 24].map((h, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className={`w-full rounded-t-xl`} style={{ height: `${h * 4}px` }} />
          </div>
        ))}
      </div>
      {/* 리스트 skeleton */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3"
          >
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex flex-1 flex-col gap-1">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3 w-14" />
            </div>
            <Skeleton className="h-4 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}
