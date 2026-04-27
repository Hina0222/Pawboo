import { Header } from '@/widgets/header';
import SearchIcon from '@/shared/assets/icons/SearchIcon.svg';
import testImg from '@/shared/assets/images/testImg.png';
import HomePostList from './ui/home-post-list';

export default async function HomePage() {
  return (
    <>
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

      <HomePostList />
    </>
  );
}
