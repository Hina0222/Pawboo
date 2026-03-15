import { Skeleton } from '@/shared/ui';

export function FeedDetailSkeleton() {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-4">
      <div className="flex items-center gap-2 px-5">
        <Skeleton className="size-8 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
      <Skeleton className="aspect-square w-full" />
      <div className="flex gap-1.5 px-5">
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <div className="flex gap-2 px-5">
        <Skeleton className="h-7 w-14" />
        <Skeleton className="h-7 w-14" />
      </div>
    </div>
  );
}
