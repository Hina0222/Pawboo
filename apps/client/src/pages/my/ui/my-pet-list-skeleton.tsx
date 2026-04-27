import { Skeleton } from '@/shared/ui';

function MyPetListSkeleton() {
  return (
    <ul className="scrollbar-hide flex items-start gap-4 overflow-x-auto">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="flex w-[92px] flex-shrink-0 flex-col items-center gap-3.5">
          <Skeleton className="h-[88px] w-[92px] rounded-full" />
          <Skeleton className="h-4 w-16" />
        </li>
      ))}
    </ul>
  );
}

export default MyPetListSkeleton;
