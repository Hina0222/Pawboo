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
        className="gap-0 overflow-hidden p-0 md:max-w-3xl"
        onPointerDownOutside={e => {
          if (e.detail.originalEvent.button !== 0) {
            e.preventDefault();
          }
        }}
      >
        <DialogTitle className="sr-only">피드 상세</DialogTitle>
        <div className="flex flex-col md:flex-row">
          <div className="md:flex-1 md:overflow-y-auto">
            <FeedDetail id={Number(id)} />
          </div>
          <div className="flex flex-col md:border-l">
            <div className="hidden flex-1 overflow-y-auto px-5 py-4 md:block">
              <CommentList submissionId={id} />
            </div>
            <div className="shrink-0 px-5 py-4">
              <CreateCommentForm submissionId={id} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FeedDetailModal;
