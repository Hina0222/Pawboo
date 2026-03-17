import { Skeleton } from '@/shared/ui';

export function UserSearchListSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-5 py-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  );
}
