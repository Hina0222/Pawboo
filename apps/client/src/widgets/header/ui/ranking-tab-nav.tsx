'use client';

import { Tabs, TabsList, TabsTrigger } from '@/shared/ui';
import { Link } from '@/app/i18n/navigation';
import { usePathname } from '@/app/i18n/navigation';
import { useTranslations } from 'next-intl';

export function RankingTabNav() {
  const pathname = usePathname();
  const t = useTranslations('ranking');

  const TABS = [
    { label: t('all'), href: '/ranking' },
    { label: t('weekly'), href: '/ranking/weekly' },
    { label: t('monthly'), href: '/ranking/monthly' },
  ] as const;

  return (
    <Tabs className="px-5 pb-2">
      <TabsList variant="line" className="w-full">
        <TabsList variant="line" className="w-full">
          {TABS.map(tab => {
            const isActive = pathname === tab.href;

            return (
              <TabsTrigger
                key={tab.href}
                value={tab.href}
                data-state={isActive ? 'active' : 'inactive'}
                asChild
              >
                <Link href={tab.href}>{tab.label}</Link>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </TabsList>
    </Tabs>
  );
}
