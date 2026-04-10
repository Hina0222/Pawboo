'use client';

import type { FallbackProps } from 'react-error-boundary';
import { useTranslations } from 'next-intl';

export function UserSearchListError({ resetErrorBoundary }: FallbackProps) {
  const t = useTranslations('community');
  const tc = useTranslations('common');
  return (
    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
      <p className="text-sm">{t('searchError')}</p>
      <button onClick={resetErrorBoundary} className="mt-2 text-xs text-red-400 underline">
        {tc('retry')}
      </button>
    </div>
  );
}
