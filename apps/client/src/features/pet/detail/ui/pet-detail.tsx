'use client';

import { Button } from '@/shared/ui/button';
import { useActivatePetMutation } from '@/features/pet/edit/api/useActivatePetMutation';
import { useGetPetSuspenseQuery } from '@/features/pet/detail/api/useGetPetQuery';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { PetDetailError, PetDetailSkeleton } from '@/features/pet/detail/ui';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { useDeletePetMutation } from '@/features/pet/delete/api/useDeletePetMutation';
import { useTranslations } from 'next-intl';

interface PetDetailProps {
  id: number;
}

function PetDetail({ id }: PetDetailProps) {
  const t = useTranslations('pet');
  const tc = useTranslations('common');
  const { data: pet } = useGetPetSuspenseQuery(id);
  const { mutate: activatePet, isPending } = useActivatePetMutation();
  const { mutate: deletePet } = useDeletePetMutation();

  return (
    <section className="flex flex-col gap-px px-5">
      <InfoRow label={t('breed')} value={pet.breed} />
      <InfoRow label={t('birthDate')} value={pet.birthDate} />
      <InfoRow label={t('gender')} value={pet.gender ? tc(pet.gender) : null} />
      <InfoRow label={t('introduction')} value={pet.bio} />
      <InfoRow label={t('totalScore')} value={String(pet.score)} />
      <InfoRow label={t('weeklyScore')} value={String(pet.weeklyScore)} />
      <InfoRow label={t('monthlyScore')} value={String(pet.monthlyScore)} />

      <Button
        variant="outline"
        size="sm"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          deletePet(pet.id);
        }}
        className="mt-1 w-full border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive"
      >
        <Trash2 size={13} />
        {t('deleteButton')}
      </Button>
      {!pet.isActive && (
        <Button
          variant="outline"
          onClick={() => activatePet(id)}
          disabled={isPending}
          className="mt-2 w-full"
          size="lg"
        >
          {isPending ? tc('processing') : t('setRepresentative')}
        </Button>
      )}
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value ?? '-'}</span>
    </div>
  );
}

export default withErrorBoundary(withSuspense(PetDetail, <PetDetailSkeleton />), PetDetailError);
