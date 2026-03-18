import { BottomNav } from '@/widgets/bottom-nav';
import { TitleHeader } from '@/widgets/header';
import { FeedList } from '@/features/feed/list/ui';
import { ServerFetchBoundary } from '@/shared/boundary/server-fetch-boundary';
import { getFeedsInfiniteQueryOptions } from '@/features/feed/list/api/useGetFeedsInfiniteQuery';

export default async function HomePage() {
  return (
    <div className="pb-20">
      <TitleHeader title="홈" />
      <ServerFetchBoundary queryOptions={getFeedsInfiniteQueryOptions()}>
        <FeedList />
      </ServerFetchBoundary>
      <BottomNav />
    </div>
  );
}
