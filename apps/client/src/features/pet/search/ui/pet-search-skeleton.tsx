import { Skeleton } from '@/shared/ui/skeleton';

export function PetSearchSkeleton() {
  return (
    <ul>
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 px-5 py-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-28 rounded" />
        </li>
      ))}
    </ul>
  );
}
