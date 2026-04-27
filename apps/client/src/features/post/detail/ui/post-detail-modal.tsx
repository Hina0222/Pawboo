'use client';

import { Dialog, DialogContent, DialogTitle } from '@/shared/ui';
import React from 'react';
import { usePathname, useRouter } from '@/app/i18n/navigation';
import PostDetail from '@/features/post/detail/ui/post-detail';

interface PostDetailModalProps {
  id: number;
}

function PostDetailModal({ id }: PostDetailModalProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname !== `/post/${id}`) {
    return null;
  }

  return (
    <Dialog open onOpenChange={open => !open && router.back()}>
      <DialogContent
        showCloseButton={true}
        aria-describedby={undefined}
        onPointerDownOutside={e => {
          if (e.detail.originalEvent.button !== 0) {
            e.preventDefault();
          }
        }}
      >
        <DialogTitle className="sr-only">Post Title</DialogTitle>

        <PostDetail id={Number(id)} />
      </DialogContent>
    </Dialog>
  );
}

export default PostDetailModal;
