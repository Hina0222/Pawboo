'use client';

import { Pencil, Star, X } from 'lucide-react';
import { useGetPetSuspenseQuery } from '@/features/pet/detail/api/useGetPetQuery';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { PetProfileCardError, PetProfileCardSkeleton } from '@/features/pet/detail/ui';

const PET_TYPE_LABEL = { dog: '강아지', cat: '고양이' } as const;

interface PetProfileCardProps {
  id: number;
  isEditing?: boolean;
  onToggle?: () => void;
}

function PetProfileCard({ id, isEditing, onToggle }: PetProfileCardProps) {
  const { data: pet } = useGetPetSuspenseQuery(id);

  return (
    <section className="mx-5 mb-6 flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[oklch(0.268_0.007_34.298)] text-3xl">
        {pet.imageUrl ? (
          <img src={pet.imageUrl} alt={pet.name} className="h-full w-full object-cover" />
        ) : pet.type === 'dog' ? (
          '🐶'
        ) : (
          '🐱'
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-base font-semibold text-foreground">{pet.name}</span>
          {pet.isActive && (
            <span className="flex items-center gap-0.5 rounded-full bg-[oklch(0.72_0.18_42/15%)] px-2 py-0.5 text-xs font-medium text-[oklch(0.72_0.18_42)]">
              <Star size={10} className="fill-current" />
              대표
            </span>
          )}
        </div>
        <span className="mt-0.5 inline-block rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
          {PET_TYPE_LABEL[pet.type]}
        </span>
      </div>
      {onToggle && (
        <button
          onClick={onToggle}
          className="flex-shrink-0 text-muted-foreground transition-colors hover:text-foreground"
        >
          {isEditing ? <X size={18} /> : <Pencil size={18} />}
        </button>
      )}
    </section>
  );
}

export default withErrorBoundary(
  withSuspense(PetProfileCard, <PetProfileCardSkeleton />),
  PetProfileCardError
);
