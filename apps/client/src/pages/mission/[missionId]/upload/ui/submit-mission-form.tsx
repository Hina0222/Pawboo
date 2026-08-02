'use client';

import { useSubmitMissionForm } from '@/features/mission/submit';
import { ImageEditorForm } from '@/features/image-canvas';

interface SubmitMissionFormProps {
  missionId: number;
}

export const SubmitMissionForm = ({ missionId }: SubmitMissionFormProps) => {
  const { methods, onSubmit, isPending } = useSubmitMissionForm(missionId);

  return (
    <ImageEditorForm
      methods={methods}
      onSubmit={onSubmit}
      isPending={isPending}
      submitLabel="업로드"
    />
  );
};
