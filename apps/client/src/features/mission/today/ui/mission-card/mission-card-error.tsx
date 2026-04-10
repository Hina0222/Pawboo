'use client';

import { useTranslations } from 'next-intl';

function MissionCardError() {
  const t = useTranslations('mission');
  return (
    <div className="mx-4 mt-4 flex flex-col items-center justify-center rounded-2xl bg-card py-12 text-muted-foreground shadow-sm">
      <p className="text-sm">{t('loadError')}</p>
    </div>
  );
}

export default MissionCardError;
