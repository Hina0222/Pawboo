import FeedDetailModal from '@/features/feed/detail/ui/feed-detail-modal';
import { ServerFetchBoundary } from '@/shared/boundary/server-fetch-boundary';
import { getFeedQueryOptions } from '@/features/feed/detail/api/useGetFeedQuery';

interface FeedModalProps {
  params: Promise<{ id: string }>;
}

export default async function FeedModal({ params }: FeedModalProps) {
  const { id } = await params;
  const feedId = Number(id);

  return (
    <ServerFetchBoundary queryOptions={getFeedQueryOptions(feedId)}>
      <FeedDetailModal id={feedId} />
    </ServerFetchBoundary>
  );
}
