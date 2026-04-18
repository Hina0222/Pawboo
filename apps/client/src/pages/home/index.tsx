import { BottomNav } from '@/widgets/bottom-nav';
import { TitleHeader } from '@/widgets/header';
import { FeedList } from '@/features/feed/list/ui';
import { ServerFetchBoundary } from '@/shared/boundary/server-fetch-boundary';
import { MissionCard } from '@/features/mission/today/ui/mission-card';
import { getTodayMissionQueryOptions } from '@/features/mission/today/api/useGetTodayMissionQuery';

export default async function HomePage() {
  return (
    <div className="pb-20">
      <TitleHeader title="Pawboo" />
      <ServerFetchBoundary queryOptions={getTodayMissionQueryOptions()}>
        <MissionCard />
        <FeedList />
      </ServerFetchBoundary>
      <BottomNav />
    </div>
  );
}
