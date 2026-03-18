import type { SubmissionResponse } from '@bragram/schemas/mission';

interface HistoryItemProps {
  submission: SubmissionResponse;
}

function HistoryItem({ submission }: HistoryItemProps) {
  const date = new Date(submission.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex gap-3 py-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
        <img
          src={submission.imageUrls[0]}
          alt="미션 제출 이미지"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-1">
        <span className="text-xs text-muted-foreground">{date}</span>
        {submission.comment && <p className="truncate text-sm">{submission.comment}</p>}
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
  );
}

export default HistoryItem;
