'use client';

import { type ChangeEvent, useRef, useState } from 'react';
import { StepPetType, StepBasicInfo, StepPhoto } from '@/features/pet/create/ui';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useForm } from 'react-hook-form';
import { CreatePetRequest, CreatePetSchema } from '@bragram/schemas/pet';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui';
import { useCreatePetMutation } from '@/features/pet/create/api/useCreatePetMutation';

const TOTAL_STEPS = 3;

export function CreatePetForm() {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate } = useCreatePetMutation();

  const {
    register,
    control,
    trigger,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreatePetRequest>({
    resolver: zodResolver(CreatePetSchema),
    defaultValues: { name: '', breed: '', birthDate: '', bio: '' },
  });

  const petType = watch('type');
  const nameValue = watch('name');

  const canNext = () => {
    if (step === 1) return !!petType;
    if (step === 2) return (nameValue ?? '').trim().length > 0;
    return true;
  };

  const handleNext = async () => {
    if (step === 2) {
      const valid = await trigger(['name', 'breed', 'birthDate', 'bio']);
      if (!valid) return;
    }
    if (step < TOTAL_STEPS) {
      setStep(s => s + 1);
    }
  };

  const onSubmit = (data: CreatePetRequest) => {
    if (!photoFile) return;
    mutate({ ...data, image: photoFile });
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhoto(URL.createObjectURL(file));
  };

  return (
    <>
      {/* 상단 헤더 */}
      <header className="flex items-center px-5 pt-12 pb-4">
        {step > 1 && (
          <button
            onClick={() => setStep(s => s - 1)}
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

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col px-5">
          {step === 1 && (
            <StepPetType selected={petType} onSelect={type => setValue('type', type)} />
          )}
          {step === 2 && <StepBasicInfo register={register} control={control} errors={errors} />}
          {step === 3 && (
            <StepPhoto photo={photo} onFileClick={() => fileInputRef.current?.click()} />
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />

        {/* 하단 버튼 */}
        <div className="px-5 pt-4 pb-10">
          <Button
            type={step === TOTAL_STEPS ? 'submit' : 'button'}
            className="h-13 w-full rounded-2xl bg-brand text-base font-semibold text-primary-foreground hover:bg-brand-dark"
            onClick={step === TOTAL_STEPS ? undefined : handleNext}
            disabled={!canNext()}
          >
            {step === TOTAL_STEPS ? '완료하기' : '다음'}
          </Button>
        </div>
      </form>
    </>
  );
}
