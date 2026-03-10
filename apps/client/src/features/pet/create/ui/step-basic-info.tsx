'use client';

import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import type { CreatePetRequest, PetGender } from '@bragram/schemas/pet';
import { cn } from '@/shared/lib/utils';

export function StepBasicInfo({
  register,
  control,
  errors,
}: {
  register: UseFormRegister<CreatePetRequest>;
  control: Control<CreatePetRequest>;
  errors: FieldErrors<CreatePetRequest>;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">기본 정보</h2>
        <p className="text-sm text-muted-foreground">반려동물에 대해 알려주세요</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* 이름 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            이름 <span className="text-brand">*</span>
          </label>
          <input
            {...register('name')}
            type="text"
            placeholder="반려동물 이름"
            className={cn(
              'h-12 w-full rounded-xl border bg-card px-4 text-foreground transition-colors placeholder:text-muted-foreground focus:outline-none',
              errors.name
                ? 'border-destructive focus:border-destructive'
                : 'border-border focus:border-brand'
            )}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        {/* 품종 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            품종 <span className="text-xs text-muted-foreground">(선택)</span>
          </label>
          <input
            {...register('breed')}
            type="text"
            placeholder="예: 말티즈, 코리안숏헤어"
            className={cn(
              'h-12 w-full rounded-xl border bg-card px-4 text-foreground transition-colors placeholder:text-muted-foreground focus:outline-none',
              errors.breed
                ? 'border-destructive focus:border-destructive'
                : 'border-border focus:border-brand'
            )}
          />
          {errors.breed && <p className="text-xs text-destructive">{errors.breed.message}</p>}
        </div>

        {/* 성별 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            성별 <span className="text-xs text-muted-foreground">(선택)</span>
          </label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <div className="flex gap-3">
                {(
                  [
                    { val: 'male' as PetGender, label: '남아 ♂' },
                    { val: 'female' as PetGender, label: '여아 ♀' },
                  ] as { val: PetGender; label: string }[]
                ).map(({ val, label }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => field.onChange(field.value === val ? undefined : val)}
                    className={cn(
                      'h-12 flex-1 rounded-xl border-2 text-sm font-medium transition-all',
                      field.value === val
                        ? 'border-brand bg-brand/12 text-brand'
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
            생년월일 <span className="text-xs text-muted-foreground">(선택)</span>
          </label>
          <input
            {...register('birthDate')}
            type="date"
            className={cn(
              'h-12 w-full rounded-xl border bg-card px-4 text-foreground transition-colors focus:outline-none',
              errors.birthDate
                ? 'border-destructive focus:border-destructive'
                : 'border-border focus:border-brand'
            )}
          />
          {errors.birthDate && (
            <p className="text-xs text-destructive">{errors.birthDate.message}</p>
          )}
        </div>

        {/* 소개 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            소개 <span className="text-xs text-muted-foreground">(선택)</span>
          </label>
          <textarea
            {...register('bio')}
            placeholder="반려동물을 소개해주세요 (최대 60자)"
            maxLength={60}
            rows={3}
            className={cn(
              'w-full resize-none rounded-xl border bg-card px-4 py-3 text-foreground transition-colors placeholder:text-muted-foreground focus:outline-none',
              errors.bio
                ? 'border-destructive focus:border-destructive'
                : 'border-border focus:border-brand'
            )}
          />
          {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
        </div>
      </div>
    </div>
  );
}
