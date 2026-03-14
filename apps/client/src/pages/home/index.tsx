'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { BottomNav } from '@/widgets/bottom-nav';
import { TitleHeader } from '@/widgets/header';
import { FeedList } from '@/features/feed/list/ui';
import { CommentList } from '@/features/comment/list/ui';
import { CreateCommentForm } from '@/features/comment/create/ui';
import { Button } from '@/shared/ui';

export default function HomePage() {
  const [commentSubmissionId, setCommentSubmissionId] = useState<number | null>(null);

  return (
    <div className="pb-20">
      <TitleHeader title="홈" />

      <FeedList onCommentClick={setCommentSubmissionId} />

      {commentSubmissionId !== null && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setCommentSubmissionId(null)}
          />
          <div className="fixed bottom-0 left-1/2 z-50 flex h-[70dvh] w-full max-w-[390px] -translate-x-1/2 flex-col rounded-t-2xl bg-card px-5 pt-4 pb-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">댓글</span>
              <Button variant="ghost" size="icon-sm" onClick={() => setCommentSubmissionId(null)}>
                <X size={18} />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <CommentList submissionId={commentSubmissionId} />
            </div>
            <CreateCommentForm submissionId={commentSubmissionId} />
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
