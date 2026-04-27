import { Skeleton } from '@/shared/ui/skeleton';

export function EditPetFormSkeleton() {
  return (
    <div className="mt-5 mb-4 flex flex-1 flex-col justify-between px-4">
      <div className="space-y-10">
        <Skeleton className="mx-auto h-16.5 w-20 rounded-full" />
        <div className="flex flex-col gap-2.5">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-[54px] w-full rounded-[18px]" />
        </div>
      </div>
      <Skeleton className="h-[54px] w-full rounded-full" />
    </div>
  );
}
