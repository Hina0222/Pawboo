'use client';

import { Button } from '@/shared/ui/button';
import { useActivatePetMutation } from '@/features/pet/edit/api/useActivatePetMutation';
import { useGetPetSuspenseQuery } from '@/features/pet/detail/api/useGetPetQuery';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { PetDetailError, PetDetailSkeleton } from '@/features/pet/detail/ui';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { useDeletePetMutation } from '@/features/pet/delete/api/useDeletePetMutation';

const GENDER_LABEL = { male: '수컷', female: '암컷' } as const;

interface PetDetailProps {
  id: number;
}

function PetDetail({ id }: PetDetailProps) {
  const { data: pet } = useGetPetSuspenseQuery(id);
  const { mutate: activatePet, isPending } = useActivatePetMutation();
  const { mutate: deletePet } = useDeletePetMutation();

  return (
    <section className="flex flex-col gap-px px-5">
      <InfoRow label="품종" value={pet.breed} />
      <InfoRow label="생년월일" value={pet.birthDate} />
      <InfoRow label="성별" value={pet.gender ? GENDER_LABEL[pet.gender] : null} />
      <InfoRow label="소개" value={pet.bio} />
      <InfoRow label="총 점수" value={String(pet.score)} />
      <InfoRow label="주간 점수" value={String(pet.weeklyScore)} />
      <InfoRow label="월간 점수" value={String(pet.monthlyScore)} />

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
        삭제하기
      </Button>
      {!pet.isActive && (
        <Button
          variant="outline"
          onClick={() => activatePet(id)}
          disabled={isPending}
          className="mt-2 w-full"
          size="lg"
        >
          {isPending ? '처리 중...' : '대표 펫으로 설정'}
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
