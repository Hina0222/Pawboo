'use client';

import React from 'react';
import type { PetResponse } from '@pawboo/schemas/pet';
import { Link } from '@/app/i18n/navigation';
import PenIcon from '@/shared/assets/icons/PenIcon.svg';
import LogoIcon from '@/shared/assets/icons/LogoIcon.svg';
import { cn } from '@/shared/lib/utils';

interface MyPetListItemProps {
  pet: Pick<PetResponse, 'id' | 'name' | 'imageUrl' | 'isRepresentative'>;
  href: string;
  onClick?: () => void;
  disabled?: boolean;
}

function MyPetListItem({ pet, href, onClick, disabled }: MyPetListItemProps) {
  return (
    <li
      className="flex w-[92px] flex-shrink-0 cursor-pointer flex-col items-center gap-3.5"
      onClick={() => {
        if (!pet.isRepresentative && !disabled) onClick?.();
      }}
    >
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full border-[2.5px]',
          pet.isRepresentative ? 'border-white' : 'border-[#131313]'
        )}
      >
        <div className="overflow-hidden p-[3.5px]">
          {pet.imageUrl ? (
            <img
              src={pet.imageUrl}
              alt={pet.name}
              className="h-16.5 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16.5 w-20 items-center justify-center rounded-full border border-[#E1E1E3] bg-[#FADF78]">
              <LogoIcon className="h-10 w-10 text-[#C59D07]" />
            </div>
          )}
        </div>
        <Link
          className="absolute right-[-3px] bottom-[-3px] rounded-full border-3 border-[#131313] bg-white px-1 py-0.25"
          href={href}
          onClick={e => e.stopPropagation()}
        >
          <PenIcon className="text-[#131313]" />
        </Link>
      </div>
      <span className="font-semibold text-[#E1E1E3]">{pet.name}</span>
    </li>
  );
}

export default MyPetListItem;
