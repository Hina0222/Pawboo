export function PetCalendarHeaderSkeleton() {
  return (
    <div className="flex gap-x-2.5 rounded-full bg-[#333333CC] p-2 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="h-11 w-14 animate-pulse rounded-full bg-[#4A4A4A]" />
        <div className="h-4 w-16 animate-pulse rounded bg-[#4A4A4A]" />
      </div>
    </div>
  );
}
