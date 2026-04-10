'use client';

import { Dialog, DialogContent, DialogTitle } from '@/shared/ui';
import { CommentList } from '@/features/comment/list/ui';
import { CreateCommentForm } from '@/features/comment/create/ui';
import { useRouter, usePathname } from '@/app/i18n/navigation';
import { FeedDetail } from '@/features/feed/detail/ui';
import { useTranslations } from 'next-intl';

interface FeedDetailModalProps {
  id: number;
}

function FeedDetailModal({ id }: FeedDetailModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('feed');

  if (pathname !== `/feed/${id}`) {
    return null;
  }

  return (
    <Dialog open onOpenChange={open => !open && router.back()}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[calc(100svh-2rem)] gap-0 overflow-hidden p-0 md:max-w-3xl"
        onPointerDownOutside={e => {
          if (e.detail.originalEvent.button !== 0) {
            e.preventDefault();
          }
        }}
      >
        <DialogTitle className="sr-only">{t('detail')}</DialogTitle>
        <div className="flex flex-col md:h-full md:flex-row md:overflow-hidden">
          <div className="md:min-h-0 md:flex-1">
            <FeedDetail id={Number(id)} />
          </div>
          <div className="flex max-h-[calc(100svh-2rem)] flex-col md:border-l">
            <div className="mt-12 hidden flex-1 overflow-y-auto px-5 py-4 md:block">
              <CommentList submissionId={id} />
            </div>
            <div className="px-5 py-4">
              <CreateCommentForm submissionId={id} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FeedDetailModal;
