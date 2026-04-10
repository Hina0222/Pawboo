'use client';

import type { FallbackProps } from 'react-error-boundary';
import { ApiError } from '@/shared/api';
import { useTranslations } from 'next-intl';

export function FeedListError({ error, resetErrorBoundary }: FallbackProps) {
  const t = useTranslations('common');
  const { status, message } = error as ApiError;

  if (!status) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-sm">{message}</p>
        <button onClick={resetErrorBoundary} className="mt-2 text-xs text-red-400 underline">
          {t('retry')}
        </button>
      </div>
    );
  }

  if (status === 403) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-sm">{message}</p>
      </div>
    );
  }

  if (status === 404) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-sm">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <p className="text-sm">{message}</p>
      <button onClick={resetErrorBoundary} className="mt-2 text-xs text-red-400 underline">
        다시 시도
      </button>
    </div>
  );
}
