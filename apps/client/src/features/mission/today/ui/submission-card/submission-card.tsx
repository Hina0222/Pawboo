'use client';

import { Trash2 } from 'lucide-react';
import { useGetTodayMissionSuspenseQuery } from '@/features/mission/today/api/useGetTodayMissionQuery';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
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
} from '@/shared/ui';

function SubmissionCard() {
  const { data } = useGetTodayMissionSuspenseQuery();
  const { mutate, isPending } = useDeleteSubmissionMutation();
  const { submission } = data;

  if (!submission) {
    return (
      <div className="flex flex-col items-center gap-3 px-5 py-16 text-center text-muted-foreground">
        <p className="text-sm">오늘의 미션을 아직 진행하지 않았습니다.</p>
      </div>
    );
  }

  const handleDelete = () => {
    if (!confirm('제출을 삭제하시겠습니까?')) return;
    mutate({ missionId: submission.missionId, submissionId: submission.id });
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
      <Carousel className="w-full">
        <CarouselContent>
          {submission.imageUrls.map((url, i) => (
            <CarouselItem key={i}>
              <div className="relative aspect-square w-full bg-muted">
                <img src={url} alt={`제출 사진 ${i + 1}`} className="h-full w-full object-cover" />
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
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          className="mt-1 w-full border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive"
        >
          <Trash2 size={13} />
          {isPending ? '삭제 중...' : '제출 삭제'}
        </Button>
      </div>
    </div>
  );
}

export default withErrorBoundary(
  withSuspense(SubmissionCard, <SubmissionCardSkeleton />),
  SubmissionCardError
);
