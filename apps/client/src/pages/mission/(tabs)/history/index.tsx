import { MissionHistory } from '@/features/mission/history/ui';
import { getMissionHistoryInfiniteQueryOptions } from '@/features/mission/history/api/useGetMissionHistoryInfiniteQuery';
import { ServerFetchBoundary } from '@/shared/boundary/server-fetch-boundary';

export default async function MissionHistoryPage() {
  return (
    <section className="flex flex-col gap-5 px-5">
      <ServerFetchBoundary queryOptions={getMissionHistoryInfiniteQueryOptions()}>
        <MissionHistory />
      </ServerFetchBoundary>
    </section>
  );
}
