'use client';

import { Header } from '@/widgets/header';
import { PetSearch } from '@/features/pet/search/ui';
import { useTranslations } from 'next-intl';

export default function SearchPage() {
  const t = useTranslations('search');
  return (
    <div>
      <Header>
        <Header.Left>
          <Header.Back />
        </Header.Left>
      </Header>
      <PetSearch />
    </div>
  );
}
