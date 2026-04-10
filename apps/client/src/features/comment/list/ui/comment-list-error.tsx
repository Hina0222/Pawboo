'use client';

import { useTranslations } from 'next-intl';

export function CommentListError() {
  const t = useTranslations('comment');
  return (
    <div className="flex items-center justify-center py-8 text-muted-foreground">
      <p className="text-sm">{t('loadError')}</p>
    </div>
  );
}
