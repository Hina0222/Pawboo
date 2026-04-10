'use client';

import { useTranslations } from 'next-intl';

export function FeedDetailError() {
  const t = useTranslations('feed');
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <p className="text-sm">{t('loadError')}</p>
    </div>
  );
}
