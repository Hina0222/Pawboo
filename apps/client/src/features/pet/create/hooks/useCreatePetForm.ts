'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@/app/i18n/navigation';
import { useCreatePetMutation } from '@/features/pet/create/api/useCreatePetMutation';
import { CreatePetFormSchema, CreatePetFormValues } from '@/features/pet/create/model/schema';

export const TOTAL_STEPS = 3;

const stepFields: Record<number, (keyof CreatePetFormValues)[]> = {
  1: ['type'],
  2: ['name', 'breed', 'birthDate', 'bio'],
};

export function useCreatePetForm(redirectTo = '/') {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { mutate } = useCreatePetMutation();

  const methods = useForm<CreatePetFormValues>({
    resolver: zodResolver(CreatePetFormSchema),
    defaultValues: {
      name: '',
      breed: '',
      birthDate: '',
      bio: '',
    },
  });
  const { handleSubmit, trigger, control } = methods;
  const [type, name] = useWatch({ control, name: ['type', 'name'] });

  const canNext = () => {
    switch (step) {
      case 1:
        return !!type;
      case 2:
        return !!name?.trim();
      default:
        return true;
    }
  };

  const onSubmit = (data: CreatePetFormValues) => {
    mutate(data, {
      onSuccess: () => {
        router.push(redirectTo);
      },
    });
  };

  const handleNext = async () => {
    const fields = stepFields[step];
    if (fields) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setStep(s => s - 1);
  };

  const handleButtonClick = () => {
    if (step === TOTAL_STEPS) {
      handleSubmit(onSubmit)();
    } else {
      handleNext();
    }
  };

  return {
    step,
    methods,
    canNext,
    handleButtonClick,
    handleBack,
    TOTAL_STEPS,
  };
}
