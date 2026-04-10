'use client';

import { StepPetType, StepBasicInfo, StepPhoto } from '@/features/pet/create/ui';
import { cn } from '@/shared/lib/utils';
import { FormProvider } from 'react-hook-form';
import { Button } from '@/shared/ui';
import { useCreatePetForm } from '@/features/pet/create/hooks/useCreatePetForm';
import { useTranslations } from 'next-intl';

interface CreatePetFormProps {
  redirectTo?: string;
}

export function CreatePetForm({ redirectTo }: CreatePetFormProps) {
  const tc = useTranslations('common');
  const { step, methods, canNext, handleButtonClick, handleBack, TOTAL_STEPS } =
    useCreatePetForm(redirectTo);

  return (
    <>
      {/* 진행 바 */}
      <div className="mt-4 mb-8 flex gap-1.5 px-5">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i < step ? 'bg-primary' : 'bg-border'
            )}
          />
        ))}
      </div>

      <FormProvider {...methods}>
        <form onSubmit={e => e.preventDefault()} className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col px-5">
            {step === 1 && <StepPetType />}
            {step === 2 && <StepBasicInfo />}
            {step === 3 && <StepPhoto />}
          </div>
        </form>
      </FormProvider>

      {/* 하단 버튼 */}
      <div className="flex gap-4 px-5 pt-4 pb-10">
        {step > 1 && (
          <Button
            type="button"
            className="h-13 flex-1 rounded-2xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
            onClick={handleBack}
          >
            {tc('previous')}
          </Button>
        )}
        <Button
          type="button"
          className="h-13 flex-1 rounded-2xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
          onClick={handleButtonClick}
          disabled={!canNext()}
        >
          {step === TOTAL_STEPS ? tc('complete') : tc('next')}
        </Button>
      </div>
    </>
  );
}
