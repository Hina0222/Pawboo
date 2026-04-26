import { Skeleton } from '@/shared/ui';

export function PostDetailSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Skeleton className="aspect-square w-full rounded-[30px]" />
      <Skeleton className="h-15 w-35 rounded-full" />
    </div>
  );
}
