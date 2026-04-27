import { useTranslations } from 'next-intl';

export function PostGridError() {
  const t = useTranslations('post');
  return (
    <div className="flex justify-center py-10 text-sm text-muted-foreground">
      <p>{t('loadError')}</p>
    </div>
  );
}
