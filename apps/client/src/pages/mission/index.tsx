import { Header } from '@/widgets/header';
import SearchIcon from '@/shared/assets/icons/SearchIcon.svg';
import { PetAvatar } from '@/widgets/pet-avatar';
import { MissionCard } from '@/features/mission/today/ui/mission-card';
import MissionPostList from '@/pages/mission/ui/mission-post-list';

export default async function MissionPage() {
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

      <main className="space-y-5 px-4">
        <MissionCard />
        <MissionPostList />
      </main>
    </>
  );
}
