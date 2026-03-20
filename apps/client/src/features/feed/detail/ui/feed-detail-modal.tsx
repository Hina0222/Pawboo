'use client';

import { Dialog, DialogContent, DialogTitle } from '@/shared/ui';
import { CommentList } from '@/features/comment/list/ui';
import { CreateCommentForm } from '@/features/comment/create/ui';
import { useRouter, usePathname } from 'next/navigation';
import { FeedDetail } from '@/features/feed/detail/ui';

interface FeedDetailModalProps {
  id: number;
}

function FeedDetailModal({ id }: FeedDetailModalProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname !== `/feed/${id}`) {
    return null;
  }

  return (
    <Dialog open onOpenChange={open => !open && router.back()}>
      <DialogContent
        aria-describedby={undefined}
        onPointerDownOutside={e => {
          if (e.detail.originalEvent.button !== 0) {
            e.preventDefault();
          }
        }}
      >
        <DialogTitle className="sr-only">피드 상세</DialogTitle>
        <FeedDetail id={Number(id)} />
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <CommentList submissionId={id} />
        </div>
        <div className="shrink-0 px-5 pb-6">
          <CreateCommentForm submissionId={id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FeedDetailModal;
