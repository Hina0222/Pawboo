'use client';

import { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { Search } from 'lucide-react';
import { BottomNav } from '@/widgets/bottom-nav';
import { UserSearchList } from '@/features/user/search/ui';
import { TitleHeader } from '@/widgets/header';

export default function CommunityPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

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
      <TitleHeader title={'커뮤니티'} />
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
        <Search size={16} className="flex-shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="닉네임으로 유저 검색..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {debouncedQuery.trim() && <UserSearchList query={debouncedQuery} />}

      <BottomNav />
    </div>
  );
}
