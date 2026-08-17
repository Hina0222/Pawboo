'use client';

import { useCreatePetForm } from '@/features/pet/create/hooks/useCreatePetForm';
import { PetForm } from '@/entities/pet/ui/pet-form';

export function CreatePetForm() {
  const { methods, onSubmit, isPending } = useCreatePetForm();
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = methods;
  const name = watch('name');

  return (
    <PetForm
      onSubmit={onSubmit}
      nameInputProps={register('name')}
      nameError={errors.name?.message}
      onImageSelect={file => setValue('image', file)}
      placeholder="닉네임을 입력해주세요 (최대 15자)"
      submitLabel="추가하기"
      submitDisabled={isPending || !name?.trim()}
      isPending={isPending}
      avatarClassName="border-[#131313]"
      avatarInnerClassName="p-[3.5px]"
    />
  );
}
