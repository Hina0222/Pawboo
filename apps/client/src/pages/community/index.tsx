'use client';

import { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { Search } from 'lucide-react';
import { BottomNav } from '@/widgets/bottom-nav';
import { UserSearchList } from '@/features/user/search/ui';
import { TitleHeader } from '@/widgets/header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import type { SearchType } from '@bragram/schemas/user';
import { useTranslations } from 'next-intl';

export default function CommunityPage() {
  const t = useTranslations('community');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('user');

  const debouncedSet = useMemo(
    () => debounce((value: string) => setDebouncedQuery(value), 300),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    debouncedSet(e.target.value);
  };

  return (
    <div className="pb-20">
      <TitleHeader title={t('title')} />
      <Tabs
        value={searchType}
        onValueChange={value => setSearchType(value as SearchType)}
        className="mt-4"
      >
        <TabsList className="mx-5 w-auto">
          <TabsTrigger value="user">{t('user')}</TabsTrigger>
          <TabsTrigger value="pet">{t('pet')}</TabsTrigger>
        </TabsList>

        <div className="mx-5 mt-4 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
          <Search size={16} className="flex-shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={
              searchType === 'user' ? t('searchUserPlaceholder') : t('searchPetPlaceholder')
            }
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <TabsContent value="user" className="mt-0">
          {debouncedQuery.trim() && <UserSearchList query={debouncedQuery} type="user" />}
        </TabsContent>

        <TabsContent value="pet" className="mt-0">
          {debouncedQuery.trim() && <UserSearchList query={debouncedQuery} type="pet" />}
        </TabsContent>
      </Tabs>

      <BottomNav />
    </div>
  );
}
