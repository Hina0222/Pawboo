'use client';

import { useSubmitMissionForm } from '@/features/mission/submit';
import { ImageEditorForm } from '@/widgets/image-editor';

interface SubmitMissionFormProps {
  missionId: number;
}

export const SubmitMissionForm = ({ missionId }: SubmitMissionFormProps) => {
  const { onSubmit, isPending } = useSubmitMissionForm(missionId);

  return <ImageEditorForm onSubmit={onSubmit} isPending={isPending} submitLabel="업로드" />;
};
