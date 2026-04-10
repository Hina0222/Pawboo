'use client';

import type { FallbackProps } from 'react-error-boundary';
import { useTranslations } from 'next-intl';

function PetDetailError({ resetErrorBoundary }: FallbackProps) {
  const t = useTranslations('pet');
  const tc = useTranslations('common');
  return (
    <div className="px-5 py-4 text-sm text-destructive">
      <p>{t('loadError')}</p>
      <button onClick={resetErrorBoundary}>{tc('retry')}</button>
    </div>
  );
}

export default PetDetailError;
