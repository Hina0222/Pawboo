import { SubmitMissionForm } from '@/features/mission/submit/ui';

interface MissionUploadPageProps {
  params: Promise<{ missionId: string }>;
}

export default async function MissionUploadPage({ params }: MissionUploadPageProps) {
  const { missionId } = await params;

  return (
    <>
      <SubmitMissionForm missionId={Number(missionId)} />
    </>
  );
}
