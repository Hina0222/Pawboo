'use client';

import React from 'react';
import type { PetResponse } from '@bragram/schemas/pet';
import { Link } from '@/app/i18n/navigation';

const PET_EMOJI: Record<string, string> = {
  dog: '🐶',
  cat: '🐱',
};

interface PetListItemProps {
  pet: Pick<PetResponse, 'id' | 'name' | 'imageUrl' | 'type'>;
  href: string;
}

function PetListItem({ pet, href }: PetListItemProps) {
  return (
    <li>
      <Link href={href}>
        <div className="flex flex-shrink-0 flex-col items-center gap-1.5">
          <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-primary/50 bg-card text-2xl">
            {pet.imageUrl ? (
              <img
                src={pet.imageUrl}
                alt={pet.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              (PET_EMOJI[pet.type] ?? '🐾')
            )}
          </div>
          <span className="text-xs text-muted-foreground">{pet.name}</span>
        </div>
      </Link>
    </li>
  );
}

export default PetListItem;
