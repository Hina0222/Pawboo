import { Header } from '@/widgets/header';
import SearchIcon from '@/shared/assets/icons/SearchIcon.svg';
import HomePetAvatar from '@/pages/home/ui/home-pet-avatar';

export default async function MissionPage() {
  return (
    <>
      <Header>
        <Header.Left>
          <HomePetAvatar />
        </Header.Left>
        <Header.Center>
          <Header.Nav />
        </Header.Center>
        <Header.Right>
          <Header.NavLink href="/search" icon={<SearchIcon />} />
        </Header.Right>
      </Header>
    </>
  );
}
