'use client';

import type { PetType } from '@pawboo/schemas/pet';
import { cn } from '@/shared/lib/utils';
import { Controller, useFormContext } from 'react-hook-form';
import type { CreatePetFormValues } from '@/features/pet/create/model/schema';
import { useTranslations } from 'next-intl';

export function StepPetType() {
  const t = useTranslations('pet');
  const tc = useTranslations('common');
  const { control } = useFormContext<CreatePetFormValues>();

  const petTypes: { type: PetType; emoji: string; label: string }[] = [
    { type: 'dog', emoji: '🐶', label: tc('dog') },
    { type: 'cat', emoji: '🐱', label: tc('cat') },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">{t('whatKind')}</h2>
        <p className="text-sm text-muted-foreground">{t('selectType')}</p>
      </div>
      <div className="mt-4 flex gap-4">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <div className="mt-4 flex flex-1 gap-4">
              {petTypes.map(({ type, emoji, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => field.onChange(type)}
                  className={cn(
                    'flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border-2 py-10',
                    field.value === type
                      ? 'border-primary bg-primary/12'
                      : 'border-border bg-card hover:border-primary/50'
                  )}
                >
                  <span className="text-5xl">{emoji}</span>
                  <span className="text-base font-semibold">{label}</span>
                </button>
              ))}
            </div>
          )}
        />
      </div>
    </div>
  );
}
