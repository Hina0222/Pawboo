'use client';

import { Dialog, DialogContent, DialogTitle } from '@/shared/ui';
import React from 'react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { withSuspense } from '@/shared/boundary';
import { getPostQueryOptions } from '@/features/post/detail/api/useGetPostQuery';
import { CalendarPostDetail } from './calendar-post-detail';

interface CalendarPostDetailModalProps {
  postIds: number[];
  open: boolean;
  onClose: () => void;
}

interface ModalBodyProps {
  postIds: number[];
  onDeleted?: () => void;
}

function ModalBody({ postIds, onDeleted }: ModalBodyProps) {
  const results = useSuspenseQueries({
    queries: postIds.map(id => getPostQueryOptions(id)),
  });
  return <CalendarPostDetail posts={results.map(r => r.data)} onDeleted={onDeleted} />;
}

const SuspendedModalBody = withSuspense(
  ModalBody,
  <div className="bg-muted aspect-square w-full animate-pulse rounded-[30px]" />
);

function CalendarPostDetailModal({ postIds, open, onClose }: CalendarPostDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent
        blur={true}
        showCloseButton={true}
        aria-describedby={undefined}
        onPointerDownOutside={e => {
          if (e.detail.originalEvent.button !== 0) {
            e.preventDefault();
          }
        }}
      >
        <DialogTitle className="sr-only">Post</DialogTitle>
        <SuspendedModalBody postIds={postIds} onDeleted={onClose} />
      </DialogContent>
    </Dialog>
  );
}

export default CalendarPostDetailModal;
