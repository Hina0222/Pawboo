import PostDetailModal from '@/features/post/detail/ui/post-detail-modal';

interface PostModalProps {
  params: Promise<{ postId: string }>;
}

export default async function PostModal({ params }: PostModalProps) {
  const { postId: postIdParam } = await params;
  const postId = Number(postIdParam);

  return <PostDetailModal id={postId} />;
}
