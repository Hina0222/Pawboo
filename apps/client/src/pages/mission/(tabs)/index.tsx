import { MissionCard } from '@/features/mission/today/ui/mission-card';
import { SubmissionCard } from '@/features/mission/today/ui/submission-card';
import { ServerFetchBoundary } from '@/shared/boundary/server-fetch-boundary';
import { getTodayMissionQueryOptions } from '@/features/mission/today/api/useGetTodayMissionQuery';

export default async function MissionPage() {
  return (
    <ServerFetchBoundary queryOptions={getTodayMissionQueryOptions()}>
      <MissionCard />
      <SubmissionCard />
    </ServerFetchBoundary>
  );
}
