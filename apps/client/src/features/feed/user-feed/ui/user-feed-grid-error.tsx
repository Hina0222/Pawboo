'use client';

import { useTranslations } from 'next-intl';

export function UserFeedGridError() {
  const t = useTranslations('feed');
  return (
    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
      <p className="text-sm">{t('feedLoadError')}</p>
    </div>
  );
}
