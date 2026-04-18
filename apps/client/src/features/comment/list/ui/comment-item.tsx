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
import type { CommentItem as CommentItemType } from '@pawboo/schemas/comment';
import { Link } from '@/app/i18n/navigation';
import { timeAgo } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';

interface CommentItemProps {
  comment: CommentItemType;
  submissionId: number;
  isOwner: boolean;
}

export function CommentItem({ comment, submissionId, isOwner }: CommentItemProps) {
  const t = useTranslations('comment');
  const tc = useTranslations('common');
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
              <DialogTitle>{t('deleteTitle')}</DialogTitle>
              <DialogDescription>{t('deleteConfirm')}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="outline" disabled={isPending}>
                  {tc('cancel')}
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => deleteComment(comment.id)}
                disabled={isPending}
              >
                {isPending ? tc('deleting') : tc('delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
