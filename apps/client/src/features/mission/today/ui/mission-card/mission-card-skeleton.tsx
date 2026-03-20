import { Skeleton } from '@/shared/ui';

function MissionCardSkeleton() {
  return (
    <div className="mx-4 mt-4 overflow-hidden rounded-2xl bg-primary/20 p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* 뱃지 */}
        <Skeleton className="h-5 w-28 rounded" />
        {/* 제목 */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        {/* 버튼 */}
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export default MissionCardSkeleton;
