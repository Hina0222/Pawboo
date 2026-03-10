'use client';

import type { PetType } from '@bragram/schemas/pet';
import { cn } from '@/shared/lib/utils';

export function StepPetType({
  selected,
  onSelect,
}: {
  selected: PetType | undefined;
  onSelect: (t: PetType) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">어떤 반려동물인가요?</h2>
        <p className="text-sm text-muted-foreground">반려동물 종류를 선택해주세요</p>
      </div>
      <div className="mt-4 flex gap-4">
        {(
          [
            { type: 'dog' as PetType, emoji: '🐶', label: '강아지' },
            { type: 'cat' as PetType, emoji: '🐱', label: '고양이' },
          ] as { type: PetType; emoji: string; label: string }[]
        ).map(({ type, emoji, label }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border-2 py-10 transition-all duration-200',
              selected === type
                ? 'border-brand bg-brand/12'
                : 'border-border bg-card hover:border-brand/50'
            )}
          >
            <span className="text-5xl">{emoji}</span>
            <span
              className={cn(
                'text-base font-semibold',
                selected === type ? 'text-brand' : 'text-foreground'
              )}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
