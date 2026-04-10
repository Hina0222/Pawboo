'use client';

import { useTranslations } from 'next-intl';

function MissionHistoryError() {
  const t = useTranslations('mission');
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <p className="text-sm">{t('historyLoadError')}</p>
    </div>
  );
}

export default MissionHistoryError;
