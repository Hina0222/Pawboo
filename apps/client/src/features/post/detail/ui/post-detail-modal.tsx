'use client';

import { Dialog, DialogContent, DialogTitle } from '@/shared/ui';
import React from 'react';
import PostDetail from '@/features/post/detail/ui/post-detail';

interface PostDetailModalProps {
  id: number;
  open: boolean;
  onClose: () => void;
}

function PostDetailModal({ id, open, onClose }: PostDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent
        showCloseButton={true}
        aria-describedby={undefined}
        onClick={() => onClose()}
        onPointerDownOutside={e => {
          if (e.detail.originalEvent.button !== 0) {
            e.preventDefault();
          }
        }}
      >
        <DialogTitle className="sr-only">Post</DialogTitle>
        <PostDetail id={id} />
      </DialogContent>
    </Dialog>
  );
}

export default PostDetailModal;
