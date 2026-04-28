'use client';

import { useGetPetsSuspenseQuery } from '@/features/pet/list/api/useGetPetsQuery';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { Header } from '@/widgets/header';
import LogoIcon from '@/shared/assets/icons/LogoIcon.svg';
import PlusIcon from '@/shared/assets/icons/PlusIcon.svg';
import { HomePetAvatarError } from './home-pet-avatar-error';
import { HomePetAvatarSkeleton } from './home-pet-avatar-skeleton';

function HomePetAvatar() {
  const { data: pets } = useGetPetsSuspenseQuery();

  if (pets.length === 0) {
    return <Header.NavLink href="/my" icon={<PlusIcon />} />;
  }

  const representativePet = pets.find(pet => pet.isRepresentative);
  const imageUrl = representativePet?.imageUrl ?? null;

  if (imageUrl) {
    return <Header.NavLink href="/my" image={{ src: imageUrl, alt: 'my 페이지' }} />;
  }

  return (
    <Header.NavLink
      href="/my"
      icon={<LogoIcon className="h-6 w-6 text-[#C59D07]" />}
      className="bg-[#FADF78]"
    />
  );
}

export default withErrorBoundary(
  withSuspense(HomePetAvatar, <HomePetAvatarSkeleton />),
  HomePetAvatarError
);
