'use client';

import { Trash2 } from 'lucide-react';
import { useGetTodayMissionSuspenseQuery } from '@/features/mission/today/api/useGetTodayMissionQuery';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import {
  SubmissionCardError,
  SubmissionCardSkeleton,
} from '@/features/mission/today/ui/submission-card';
import { useDeleteSubmissionMutation } from '@/features/mission/delete/api/useDeleteSubmissionMutation';

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
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="w-full">
        <img src={submission.imageUrl} alt="제출 사진" className="w-full object-cover" />
      </div>
      <div className="flex flex-col gap-2 p-4">
        {submission.comment && <p className="text-sm text-foreground">{submission.comment}</p>}
        {submission.hashtags && submission.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {submission.hashtags.map(tag => (
              <span
                key={tag}
                className="rounded-full bg-[oklch(0.72_0.18_42/10%)] px-2.5 py-1 text-xs text-[oklch(0.72_0.18_42)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border border-destructive/40 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/5 disabled:opacity-50"
        >
          <Trash2 size={13} />
          {isPending ? '삭제 중...' : '제출 삭제'}
        </button>
      </div>
    </div>
  );
}

export default withErrorBoundary(
  withSuspense(SubmissionCard, <SubmissionCardSkeleton />),
  SubmissionCardError
);
