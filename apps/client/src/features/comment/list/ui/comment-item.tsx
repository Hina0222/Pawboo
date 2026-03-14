'use client';

import Image from 'next/image';
import { ImageOff, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui';
import { useAuthStore } from '@/shared/store/auth-store';
import { useDeleteCommentMutation } from '@/features/comment/delete/api/useDeleteCommentMutation';
import type { CommentItem as CommentItemType } from '@bragram/schemas/comment';

interface CommentItemProps {
  comment: CommentItemType;
  submissionId: number;
}

export function CommentItem({ comment, submissionId }: CommentItemProps) {
  const currentUser = useAuthStore(state => state.user);
  const { mutate: deleteComment, isPending } = useDeleteCommentMutation(submissionId);

  const isOwner = currentUser?.id === comment.author.id;

  return (
    <div className="flex gap-2.5">
      <div className="relative size-7 shrink-0 overflow-hidden rounded-full bg-muted">
        {comment.author.profileImage ? (
          <Image
            src={comment.author.profileImage}
            alt={comment.author.nickname}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff size={12} className="text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-xs font-medium text-foreground">{comment.author.nickname}</span>
        <p className="text-sm text-foreground">{comment.content}</p>
        <span className="text-xs text-muted-foreground">
          {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
        </span>
      </div>
      {isOwner && (
        <Button
          variant="ghost"
          size="icon-xs"
          disabled={isPending}
          onClick={() => deleteComment(comment.id)}
          className="shrink-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 size={14} />
        </Button>
      )}
    </div>
  );
}
