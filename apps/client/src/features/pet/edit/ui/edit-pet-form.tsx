'use client';

import { useUpdatePetForm } from '@/features/pet/edit/hooks/useUpdatePetForm';
import { useGetPetSuspenseQuery } from '@/features/pet/detail/api/useGetPetQuery';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { PetForm } from '@/entities/pet/ui/pet-form';
import { useTranslations } from 'next-intl';
import { EditPetFormSkeleton, EditPetFormError } from './index';

interface EditPetFormProps {
  id: number;
}

function EditPetForm({ id }: EditPetFormProps) {
  const t = useTranslations('pet');
  const { data: pet } = useGetPetSuspenseQuery(id);
  const { methods, onSubmit, isPending } = useUpdatePetForm(pet);
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
      initialPreviewUrl={pet?.imageUrl}
      placeholder={t('enterName')}
      submitLabel="저장하기"
      submitDisabled={isPending || !name?.trim()}
      isPending={isPending}
      avatarClassName="border-[#E1E1E3]"
    />
  );
}

export default withErrorBoundary(
  withSuspense(EditPetForm, <EditPetFormSkeleton />),
  EditPetFormError
);
