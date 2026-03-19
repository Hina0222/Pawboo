'use client';

import { StepPetType, StepBasicInfo, StepPhoto } from '@/features/pet/create/ui';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { FormProvider } from 'react-hook-form';
import { Button } from '@/shared/ui';
import { useCreatePetForm } from '@/features/pet/create/hooks/useCreatePetForm';

interface CreatePetFormProps {
  redirectTo?: string;
}

export function CreatePetForm({ redirectTo }: CreatePetFormProps) {
  const { step, methods, canNext, handleButtonClick, handleBack, TOTAL_STEPS } =
    useCreatePetForm(redirectTo);

  return (
    <>
      {/* 상단 헤더 */}
      <header className="flex items-center px-5 pt-12 pb-4">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft size={24} />
          </button>
        )}
      </header>

      {/* 진행 바 */}
      <div className="mb-8 flex gap-1.5 px-5">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i < step ? 'bg-brand' : 'bg-border'
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
      <div className="px-5 pt-4 pb-10">
        <Button
          type="button"
          className="h-13 w-full rounded-2xl bg-brand text-base font-semibold text-primary-foreground hover:bg-brand-dark"
          onClick={handleButtonClick}
          disabled={!canNext()}
        >
          {step === TOTAL_STEPS ? '완료하기' : '다음'}
        </Button>
      </div>
    </>
  );
}
