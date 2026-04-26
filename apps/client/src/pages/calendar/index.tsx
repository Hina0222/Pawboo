'use client';

import { Header } from '@/widgets/header';
import testImg from '@/shared/assets/images/testImg.png';
import SearchIcon from '@/shared/assets/icons/SearchIcon.svg';

export default function CalendarPage() {
  return (
    <div>
      <Header>
        <Header.Left>
          <Header.NavLink href="/my" image={{ src: testImg.src, alt: 'my 페이지' }} />
        </Header.Left>
        <Header.Center>
          <Header.Nav />
        </Header.Center>
        <Header.Right>
          <Header.NavLink href="/search" icon={<SearchIcon />} />
        </Header.Right>
      </Header>
    </div>
  );
}
