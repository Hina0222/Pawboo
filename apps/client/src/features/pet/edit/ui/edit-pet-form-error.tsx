'use client';

import { useTranslations } from 'next-intl';

export function EditPetFormError() {
  const t = useTranslations('pet');
  return (
    <div className="text-muted-foreground flex flex-1 items-center justify-center py-20 text-sm">
      <p>{t('loadError')}</p>
    </div>
  );
}
