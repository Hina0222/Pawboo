'use client';

import { Header } from '@/widgets/header';
import SearchIcon from '@/shared/assets/icons/SearchIcon.svg';
import { PetAvatar } from '@/widgets/pet-avatar';
import { CalendarView } from '@/features/calendar/ui';

export default function CalendarPage() {
  return (
    <>
      <Header>
        <Header.Left>
          <PetAvatar />
        </Header.Left>
        <Header.Center>
          <Header.Nav />
        </Header.Center>
        <Header.Right>
          <Header.NavLink href="/search" icon={<SearchIcon />} />
        </Header.Right>
      </Header>
      <CalendarView />
    </>
  );
}
