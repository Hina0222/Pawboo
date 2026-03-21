import { TitleHeader } from '@/widgets/header';
import { BottomNav } from '@/widgets/bottom-nav';
import { CommentList } from '@/features/comment/list/ui';
import { CreateCommentForm } from '@/features/comment/create/ui';
import { FeedDetail } from '@/features/feed/detail/ui';
import { ServerFetchBoundary } from '@/shared/boundary/server-fetch-boundary';
import { getFeedQueryOptions } from '@/features/feed/detail/api/useGetFeedQuery';

interface FeedPageProps {
  params: Promise<{ id: string }>;
}

export default async function FeedPage({ params }: FeedPageProps) {
  const { id } = await params;
  const feedId = Number(id);

  return (
    <div className="flex flex-col pb-6">
      <TitleHeader title="피드" />

      <ServerFetchBoundary queryOptions={getFeedQueryOptions(feedId)}>
        <FeedDetail id={feedId} />

        <div className="mt-4 px-5 pt-4">
          <p className="mb-3 text-sm font-semibold">댓글</p>
          <CommentList submissionId={feedId} />
        </div>

        <div className="mt-4 px-5">
          <CreateCommentForm submissionId={feedId} />
        </div>
      </ServerFetchBoundary>

      <BottomNav />
    </div>
  );
}
