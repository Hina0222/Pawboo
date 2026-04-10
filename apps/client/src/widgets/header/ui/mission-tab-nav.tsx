'use client';

import { Link } from '@/app/i18n/navigation';
import { usePathname } from '@/app/i18n/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui';
import { useTranslations } from 'next-intl';

export function MissionTabNav() {
  const pathname = usePathname();
  const t = useTranslations('mission');
  const value = pathname === '/mission' ? 'my' : 'history';

  return (
    <Tabs defaultValue={value} className="px-5 pb-2">
      <TabsList variant="line" className="w-full">
        <TabsTrigger value="my" asChild>
          <Link href="/mission">{t('myMission')}</Link>
        </TabsTrigger>
        <TabsTrigger value="history" asChild>
          <Link href="/mission/history">{t('history')}</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
