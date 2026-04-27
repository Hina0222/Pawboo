'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { useSearchPetsSuspenseInfiniteQuery } from '@/features/pet/search/api/useSearchPetsInfiniteQuery';
import { PetSearchItem } from './pet-search-item';
import { PetSearchSkeleton } from './pet-search-skeleton';
import { PetSearchError } from './pet-search-error';

interface PetSearchListProps {
  q: string;
}

function PetSearchList({ q }: PetSearchListProps) {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useSearchPetsSuspenseInfiniteQuery(q);
  const { ref, inView } = useInView();

  const pets = data.pages.flatMap(page => page.data);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div>
      <ul className="space-y-5">
        {pets.map(pet => (
          <PetSearchItem key={pet.id} name={pet.name} imageUrl={pet.imageUrl} />
        ))}
      </ul>
      {isFetchingNextPage && <PetSearchSkeleton />}
      <div ref={ref} className="h-1" />
    </div>
  );
}

export default withErrorBoundary(
  withSuspense(PetSearchList, <PetSearchSkeleton />),
  PetSearchError
);
