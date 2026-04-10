'use client';

import { Controller, useFormContext } from 'react-hook-form';
import type { PetGender } from '@bragram/schemas/pet';
import type { CreatePetFormValues } from '@/features/pet/create/model/schema';
import { cn } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';

export function StepBasicInfo() {
  const t = useTranslations('pet');

  const genderTypes = [
    { val: 'male' as PetGender, label: t('maleSymbol') },
    { val: 'female' as PetGender, label: t('femaleSymbol') },
  ];

  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CreatePetFormValues>();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">{t('basicInfo')}</h2>
        <p className="text-sm text-muted-foreground">{t('tellAbout')}</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* 이름 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            {t('name')} <span className="text-primary">*</span>
          </label>
          <input
            {...register('name')}
            type="text"
            placeholder={t('namePlaceholder')}
            className={cn(
              'h-12 w-full rounded-xl border bg-card px-4 text-foreground transition-colors placeholder:text-muted-foreground focus:outline-none',
              errors.name
                ? 'border-destructive focus:border-destructive'
                : 'border-border focus:border-primary'
            )}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        {/* 품종 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            {t('breed')} <span className="text-xs text-muted-foreground">{t('optional')}</span>
          </label>
          <input
            {...register('breed')}
            type="text"
            placeholder={t('breedPlaceholder')}
            className={cn(
              'h-12 w-full rounded-xl border bg-card px-4 text-foreground transition-colors placeholder:text-muted-foreground focus:outline-none',
              errors.breed
                ? 'border-destructive focus:border-destructive'
                : 'border-border focus:border-primary'
            )}
          />
          {errors.breed && <p className="text-xs text-destructive">{errors.breed.message}</p>}
        </div>

        {/* 성별 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            {t('gender')} <span className="text-xs text-muted-foreground">{t('optional')}</span>
          </label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <div className="flex gap-3">
                {genderTypes.map(({ val, label }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => field.onChange(field.value === val ? undefined : val)}
                    className={cn(
                      'h-12 flex-1 rounded-xl border-2 text-sm font-medium transition-all',
                      field.value === val
                        ? 'border-primary bg-primary/12 text-primary'
                        : 'border-border bg-card text-foreground'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* 생년월일 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            {t('birthDate')} <span className="text-xs text-muted-foreground">{t('optional')}</span>
          </label>
          <input
            {...register('birthDate')}
            type="date"
            className={cn(
              'h-12 w-full rounded-xl border bg-card px-4 text-foreground transition-colors focus:outline-none',
              errors.birthDate
                ? 'border-destructive focus:border-destructive'
                : 'border-border focus:border-primary'
            )}
          />
          {errors.birthDate && (
            <p className="text-xs text-destructive">{errors.birthDate.message}</p>
          )}
        </div>

        {/* 소개 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            {t('introduction')}{' '}
            <span className="text-xs text-muted-foreground">{t('optional')}</span>
          </label>
          <textarea
            {...register('bio')}
            placeholder={t('introPlaceholder')}
            maxLength={60}
            rows={3}
            className={cn(
              'w-full resize-none rounded-xl border bg-card px-4 py-3 text-foreground transition-colors placeholder:text-muted-foreground focus:outline-none',
              errors.bio
                ? 'border-destructive focus:border-destructive'
                : 'border-border focus:border-primary'
            )}
          />
          {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
        </div>
      </div>
    </div>
  );
}
