'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { useMeQuery } from '@/features/user/me/api/useMeQuery';
import { useGetCommentsSuspenseInfiniteQuery } from '../api/useGetCommentsInfiniteQuery';
import { CommentItem } from './comment-item';
import { CommentListSkeleton } from './comment-list-skeleton';
import { CommentListError } from './comment-list-error';

interface CommentListProps {
  submissionId: number;
}

function CommentList({ submissionId }: CommentListProps) {
  const { data: me } = useMeQuery();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetCommentsSuspenseInfiniteQuery(submissionId);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const comments = data.pages.flatMap(page => page.data);

  if (comments.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <p className="text-sm">첫 댓글을 남겨보세요.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          submissionId={submissionId}
          isOwner={me?.id === comment.author.id}
        />
      ))}
      <div ref={ref}>
        {isFetchingNextPage && (
          <p className="py-2 text-center text-xs text-muted-foreground">불러오는 중...</p>
        )}
      </div>
    </div>
  );
}

export default withErrorBoundary(
  withSuspense(CommentList, <CommentListSkeleton />),
  CommentListError
);
