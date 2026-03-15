import FeedDetailModal from '@/features/feed/detail/ui/feed-detail-modal';

interface FeedModalProps {
  params: Promise<{ id: string }>;
}

export default async function FeedModal({ params }: FeedModalProps) {
  const { id } = await params;

  return <FeedDetailModal id={Number(id)} />;
}
