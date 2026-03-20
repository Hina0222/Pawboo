import { BottomNav } from '@/widgets/bottom-nav';
import { TitleHeader } from '@/widgets/header';
import { FeedList } from '@/features/feed/list/ui';
import { ServerFetchBoundary } from '@/shared/boundary/server-fetch-boundary';
import { getFeedsInfiniteQueryOptions } from '@/features/feed/list/api/useGetFeedsInfiniteQuery';
import { MissionCard } from '@/features/mission/today/ui/mission-card';

export default async function HomePage() {
  return (
    <div className="pb-24">
      <TitleHeader title="홈" />
      <div className="mx-4 mt-4">
        <MissionCard />
      </div>
      <ServerFetchBoundary infiniteQueryOptions={getFeedsInfiniteQueryOptions()}>
        <FeedList />
      </ServerFetchBoundary>
      <BottomNav />
    </div>
  );
}
