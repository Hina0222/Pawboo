'use client';

import { ImageOff, Trash2 } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui';
import { useDeleteCommentMutation } from '@/features/comment/delete/api/useDeleteCommentMutation';
import type { CommentItem as CommentItemType } from '@bragram/schemas/comment';
import { Link } from '@/app/i18n/navigation';
import { timeAgo } from '@/shared/lib/utils';

interface CommentItemProps {
  comment: CommentItemType;
  submissionId: number;
  isOwner: boolean;
}

export function CommentItem({ comment, submissionId, isOwner }: CommentItemProps) {
  const { mutate: deleteComment, isPending } = useDeleteCommentMutation(submissionId);

  return (
    <div className="flex gap-2.5">
      <Link href={`/community/user/${comment.author.id}`} className="size-fit">
        <div className="relative size-7 overflow-hidden rounded-full bg-muted">
          {comment.author.profileImage ? (
            <img
              src={comment.author.profileImage}
              alt={comment.author.nickname}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageOff size={12} className="text-muted-foreground" />
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-0.5">
        <Link
          href={`/community/user/${comment.author.id}`}
          className="w-fit text-xs font-medium text-foreground hover:underline"
        >
          {comment.author.nickname}
        </Link>
        <p className="text-sm text-foreground">{comment.content}</p>
        <span className="text-xs text-muted-foreground">{timeAgo(comment.createdAt)}</span>
      </div>
      {isOwner && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={isPending}
              className="shrink-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 size={14} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>댓글 삭제</DialogTitle>
              <DialogDescription>댓글을 삭제하시겠습니까?</DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="outline" disabled={isPending}>
                  취소
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => deleteComment(comment.id)}
                disabled={isPending}
              >
                {isPending ? '삭제 중...' : '삭제'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
