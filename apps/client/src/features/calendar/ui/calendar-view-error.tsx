import type { FallbackProps } from 'react-error-boundary';

export function CalendarViewError({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
      <p className="text-sm">달력을 불러오지 못했습니다.</p>
      <button onClick={resetErrorBoundary} className="text-xs underline">
        다시 시도
      </button>
    </div>
  );
}
