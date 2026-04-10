'use client';

import { Trash2 } from 'lucide-react';
import { useGetTodayMissionSuspenseQuery } from '@/features/mission/today/api/useGetTodayMissionQuery';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { useTranslations } from 'next-intl';
import {
  SubmissionCardError,
  SubmissionCardSkeleton,
} from '@/features/mission/today/ui/submission-card';
import { useDeleteSubmissionMutation } from '@/features/mission/delete/api/useDeleteSubmissionMutation';
import {
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui';

function SubmissionCard() {
  const t = useTranslations('submit');
  const tm = useTranslations('mission');
  const tc = useTranslations('common');
  const { data } = useGetTodayMissionSuspenseQuery();
  const { mutate, isPending } = useDeleteSubmissionMutation();
  const { submission } = data;

  if (!submission) {
    return (
      <div className="flex flex-col items-center gap-3 px-5 py-16 text-center text-muted-foreground">
        <p className="text-sm">{tm('notStarted')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
      <Carousel className="w-full">
        <CarouselContent>
          {submission.imageUrls.map((url, i) => (
            <CarouselItem key={i}>
              <div className="relative aspect-square w-full bg-muted">
                <img
                  src={url}
                  alt={t('submissionPhotoAlt', { index: i + 1 })}
                  className="h-full w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {submission.imageUrls.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>
      <div className="flex flex-col gap-2 p-4">
        {submission.comment && <p className="text-sm text-foreground">{submission.comment}</p>}
        {submission.hashtags && submission.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {submission.hashtags.map(tag => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              className="mt-1 w-full border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive"
            >
              <Trash2 size={13} />
              {t('deleteSubmission')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('deleteSubmission')}</DialogTitle>
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
                onClick={() =>
                  mutate({ missionId: submission.missionId, submissionId: submission.id })
                }
                disabled={isPending}
              >
                {isPending ? tc('deleting') : tc('delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default withErrorBoundary(
  withSuspense(SubmissionCard, <SubmissionCardSkeleton />),
  SubmissionCardError
);
