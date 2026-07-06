'use client';

import { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import SearchIcon from '@/shared/assets/icons/SearchIcon.svg';
import InputXIcon from '@/shared/assets/icons/InputXIcon.svg';
import PetSearchList from './pet-search-list';

export function PetSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const debouncedSet = useMemo(
    () => debounce((value: string) => setDebouncedQuery(value), 300),
    []
  );

  const handleChange = (e: { target: { value: string } }) => {
    setQuery(e.target.value);
    debouncedSet(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    debouncedSet.cancel();
  };

  return (
    <div className="space-y-5 px-4">
      <div className="flex items-center gap-2 rounded-[18px] border border-[#4D4D4D] bg-[#333333] p-4">
        <SearchIcon className="shrink-0" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="닉네임을 검색하세요"
          className="text-foreground min-w-0 flex-1 placeholder:text-[#666666] focus:outline-none"
        />
        {query.length > 0 && (
          <button type="button" onClick={handleClear}>
            <InputXIcon className="shrink-0" />
          </button>
        )}
      </div>

      {debouncedQuery.trim().length > 0 && <PetSearchList q={debouncedQuery} />}
    </div>
  );
}
