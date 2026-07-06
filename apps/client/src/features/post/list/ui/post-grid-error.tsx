import { useTranslations } from 'next-intl';

export function PostGridError() {
  const t = useTranslations('post');
  return (
    <div className="text-muted-foreground flex justify-center py-10 text-sm">
      <p>{t('loadError')}</p>
    </div>
  );
}
