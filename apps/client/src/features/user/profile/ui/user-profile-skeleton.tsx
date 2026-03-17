import { Skeleton } from '@/shared/ui';

export function UserProfileSkeleton() {
  return (
    <section className="px-5 pb-6">
      <div className="flex items-center gap-6">
        <Skeleton className="h-20 w-20 flex-shrink-0 rounded-full" />
        <div className="flex flex-1 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Skeleton className="h-6 w-10" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-1 h-3 w-32" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </section>
  );
}
