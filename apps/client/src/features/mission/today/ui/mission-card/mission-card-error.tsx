'use client';

import { useTranslations } from 'next-intl';

function MissionCardError() {
  const t = useTranslations('mission');
  return (
    <div className="bg-card text-muted-foreground mx-4 mt-4 flex flex-col items-center justify-center rounded-2xl py-12 shadow-sm">
      <p className="text-sm">{t('loadError')}</p>
    </div>
  );
}

export default MissionCardError;
