'use client';

import type { PetResponse } from '@pawboo/schemas/pet';
import { PetListItem } from '@/features/pet/list/ui';

interface PetListProps {
  pets: Pick<PetResponse, 'id' | 'name' | 'imageUrl' | 'type'>[];
  getPetHref: (petId: number) => string;
}

function PetList({ pets, getPetHref }: PetListProps) {
  if (pets.length === 0) return null;

  return (
    <ul className="scrollbar-hide flex gap-4 overflow-x-auto pb-1">
      {pets.map(pet => (
        <PetListItem pet={pet} key={pet.id} href={getPetHref(pet.id)} />
      ))}
    </ul>
  );
}

export default PetList;
