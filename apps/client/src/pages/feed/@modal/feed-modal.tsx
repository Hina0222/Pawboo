import FeedDetailModal from '@/features/feed/detail/ui/feed-detail-modal';
import { ServerFetchBoundary } from '@/shared/boundary/server-fetch-boundary';
import { getFeedQueryOptions } from '@/features/feed/detail/api/useGetFeedQuery';

interface FeedModalProps {
  params: Promise<{ feedId: string }>;
}

export default async function FeedModal({ params }: FeedModalProps) {
  const { feedId: feedIdParam } = await params;
  const feedId = Number(feedIdParam);

  return (
    <ServerFetchBoundary queryOptions={getFeedQueryOptions(feedId)}>
      <FeedDetailModal id={feedId} />
    </ServerFetchBoundary>
  );
}
