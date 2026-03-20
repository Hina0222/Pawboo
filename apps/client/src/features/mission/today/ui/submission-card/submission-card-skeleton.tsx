import { Skeleton } from '@/shared/ui';

function SubmissionCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
      {/* 이미지 영역 */}
      <Skeleton className="aspect-square w-full" />
      {/* 하단 콘텐츠 */}
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default SubmissionCardSkeleton;
