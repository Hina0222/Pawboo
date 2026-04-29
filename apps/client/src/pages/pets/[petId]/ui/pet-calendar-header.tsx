import { useGetPetSuspenseQuery } from '@/features/pet/detail/api/useGetPetQuery';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import LogoIcon from '@/shared/assets/icons/LogoIcon.svg';
import { PetCalendarHeaderSkeleton } from './pet-calendar-header-skeleton';
import { PetCalendarHeaderError } from './pet-calendar-header-error';

function PetCalendarHeader({ petId }: { petId: number }) {
  const { data: pet } = useGetPetSuspenseQuery(petId);

  return (
    <div className="flex rounded-full bg-[#333333CC] py-1.5 pr-4 pl-2 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="h-8 w-9.5 overflow-hidden rounded-full border border-[#F5F5F5]">
          {pet.imageUrl ? (
            <img src={pet.imageUrl} alt={pet.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#FADF78]">
              <LogoIcon className="h-5 w-5 text-[#C59D07]" />
            </div>
          )}
        </div>
        <span className="font-medium text-[#E1E1E3]">{pet.name}</span>
      </div>
    </div>
  );
}

export default withErrorBoundary(
  withSuspense(PetCalendarHeader, <PetCalendarHeaderSkeleton />),
  PetCalendarHeaderError
);
