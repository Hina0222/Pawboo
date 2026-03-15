'use client';

import { Tabs, TabsList, TabsTrigger } from '@/shared/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { label: '전체', href: '/ranking' },
  { label: '주간', href: '/ranking/weekly' },
  { label: '월간', href: '/ranking/monthly' },
];

export function RankingTabNav() {
  const pathname = usePathname();

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
