import { Check } from 'lucide-react';
import type { SubmissionResponse } from '@bragram/schemas/mission';

interface HistoryItemProps {
  submission: SubmissionResponse;
}

function formatRelativeDate(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (hours < 1) return '방금 전';
  if (hours < 24) return `${hours}시간 전`;
  if (days === 1) return '어제';
  if (days < 7) return `${days}일 전`;
  return new Date(date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
}

function HistoryItem({ submission }: HistoryItemProps) {
  return (
    <div className="relative pl-12">
      {/* 타임라인 원 */}
      <div className="absolute top-1 left-0 z-10 flex size-10 items-center justify-center rounded-full border-2 border-primary bg-card shadow-sm">
        <Check size={15} strokeWidth={2.5} className="text-primary" />
      </div>

      {/* 카드 */}
      <div className="rounded-2xl bg-card p-4 shadow-sm">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h4 className="text-sm font-bold">미션 인증 완료</h4>
          <span className="shrink-0 text-[10px] text-muted-foreground">
            {formatRelativeDate(submission.createdAt)}
          </span>
        </div>

        <div className="flex gap-3">
          {submission.imageUrls[0] && (
            <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
              <img
                src={submission.imageUrls[0]}
                alt="미션 제출 이미지"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex min-w-0 flex-col gap-1">
            {submission.comment && (
              <p className="text-xs leading-relaxed text-muted-foreground">{submission.comment}</p>
            )}
            {submission.hashtags && submission.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {submission.hashtags.map(tag => (
                  <span key={tag} className="text-xs text-primary">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryItem;
