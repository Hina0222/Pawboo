import { BottomNav } from '@/widgets/bottom-nav';
import { TitleHeader } from '@/widgets/header';
import { FeedList } from '@/features/feed/list/ui';
import { ServerFetchBoundary } from '@/shared/boundary/server-fetch-boundary';
import { getFeedsInfiniteQueryOptions } from '@/features/feed/list/api/useGetFeedsInfiniteQuery';
import { MissionCard } from '@/features/mission/today/ui/mission-card';
import { getTodayMissionQueryOptions } from '@/features/mission/today/api/useGetTodayMissionQuery';

export default async function HomePage() {
  return (
    <div className="pb-24">
      <TitleHeader title="홈" />
      <ServerFetchBoundary
        queryOptions={getTodayMissionQueryOptions()}
        infiniteQueryOptions={getFeedsInfiniteQueryOptions()}
      >
        <MissionCard />
        <FeedList />
      </ServerFetchBoundary>
      <BottomNav />
    </div>
  );
}
