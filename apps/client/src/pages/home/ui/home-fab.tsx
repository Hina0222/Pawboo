'use client';

import { useGetPetsSuspenseQuery } from '@/features/pet/list/api/useGetPetsQuery';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { Link } from '@/app/i18n/navigation';
import PlusIcon from '@/shared/assets/icons/PlusIcon.svg';
import ArrowIcon from '@/shared/assets/icons/ArrowIcon.svg';
import { HomeFabSkeleton } from './home-fab-skeleton';
import { HomeFabError } from './home-fab-error';

function HomeFab() {
  const { data: pets } = useGetPetsSuspenseQuery();

  if (pets.length === 0) {
    return (
      <Link
        href="/my/pets/new"
        className="absolute bottom-13 left-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-2 rounded-full bg-[#333333CC] p-4 backdrop-blur-md"
      >
        <span className="text-[#E1E1E3]">프로필 생성하기</span>
        <ArrowIcon />
      </Link>
    );
  }

  return (
    <Link
      href="/post/create"
      className="absolute bottom-13 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#333333CC] p-4 backdrop-blur-md"
    >
      <PlusIcon />
    </Link>
  );
}

export default withErrorBoundary(withSuspense(HomeFab, <HomeFabSkeleton />), HomeFabError);
