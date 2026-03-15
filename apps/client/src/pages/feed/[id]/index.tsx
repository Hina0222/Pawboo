import { TitleHeader } from '@/widgets/header';
import { BottomNav } from '@/widgets/bottom-nav';
import { CommentList } from '@/features/comment/list/ui';
import { CreateCommentForm } from '@/features/comment/create/ui';
import { FeedDetail } from '@/features/feed/detail/ui';

interface FeedPageProps {
  params: Promise<{ id: string }>;
}

export default async function FeedPage({ params }: FeedPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col pb-6">
      <TitleHeader title="피드" />

      <FeedDetail id={Number(id)} />

      <div className="mt-4 px-5 pt-4">
        <p className="mb-3 text-sm font-semibold">댓글</p>
        <CommentList submissionId={Number(id)} />
      </div>

      <div className="mt-4 px-5">
        <CreateCommentForm submissionId={Number(id)} />
      </div>

      <BottomNav />
    </div>
  );
}
