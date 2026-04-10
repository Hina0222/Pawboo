'use client';

import type { FallbackProps } from 'react-error-boundary';
import { useTranslations } from 'next-intl';

export function UserProfileError({ resetErrorBoundary }: FallbackProps) {
  const t = useTranslations('profile');
  const tc = useTranslations('common');
  return (
    <section className="flex flex-col items-center justify-center px-5 py-10 text-muted-foreground">
      <p className="text-sm">{t('loadError')}</p>
      <button onClick={resetErrorBoundary} className="mt-2 text-xs text-red-400 underline">
        {tc('retry')}
      </button>
    </section>
  );
}
