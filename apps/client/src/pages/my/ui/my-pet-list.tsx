'use client';

import { useGetPetsSuspenseQuery } from '@/features/pet/list/api/useGetPetsQuery';
import { useRepresentativePetMutation } from '@/features/pet/edit/api/useRepresentativePetMutation';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { Link } from '@/app/i18n/navigation';
import PlusIcon from '@/shared/assets/icons/PlusIcon.svg';
import MyPetListItem from './my-pet-list-item';
import MyPetListSkeleton from './my-pet-list-skeleton';
import MyPetListError from './my-pet-list-error';

function MyPetList() {
  const { data: pets } = useGetPetsSuspenseQuery();
  const { mutate, isPending, variables } = useRepresentativePetMutation();

  return (
    <ul className="scrollbar-hide flex items-start gap-4 overflow-x-auto">
      {pets.map(pet => (
        <MyPetListItem
          pet={pet}
          key={pet.id}
          href={`/my/pets/${pet.id}`}
          onClick={() => mutate(pet.id)}
          disabled={isPending && variables === pet.id}
        />
      ))}
      {pets.length !== 5 && (
        <Link href="/my/pets/new" className="flex flex-col items-center gap-3.5">
          <div className="m-1.5 rounded-full bg-[#333333CC] px-7 py-5.25">
            <PlusIcon />
          </div>
          <span className="font-semibold text-[#666666]">프로필 추가</span>
        </Link>
      )}
    </ul>
  );
}

export default withErrorBoundary(withSuspense(MyPetList, <MyPetListSkeleton />), MyPetListError);
