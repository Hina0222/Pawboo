import { Header } from '@/widgets/header';
import SearchIcon from '@/shared/assets/icons/SearchIcon.svg';
import HomePetAvatar from './ui/home-pet-avatar';
import HomePostList from './ui/home-post-list';

export default async function HomePage() {
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

      <HomePostList />
    </>
  );
}
