import type { FallbackProps } from 'react-error-boundary';

export function UserSearchListError({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
      <p className="text-sm">검색 중 오류가 발생했습니다.</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 text-xs text-[oklch(0.72_0.18_42)] underline"
      >
        다시 시도
      </button>
    </div>
  );
}
