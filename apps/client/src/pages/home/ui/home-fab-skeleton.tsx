import { Skeleton } from '@/shared/ui/skeleton';

export function HomeFabSkeleton() {
  return (
    <Skeleton className="absolute bottom-13 left-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full" />
  );
}
