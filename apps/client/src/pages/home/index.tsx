import { Header } from '@/widgets/header';
import { PostList } from '@/features/post/list/ui';
import { ServerFetchBoundary } from '@/shared/boundary/server-fetch-boundary';
import { MissionCard } from '@/features/mission/today/ui/mission-card';
import { getTodayMissionQueryOptions } from '@/features/mission/today/api/useGetTodayMissionQuery';
import SearchIcon from '@/shared/assets/icons/SearchIcon.svg';
import testImg from '@/shared/assets/images/testImg.png';

export default async function HomePage() {
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
      <ServerFetchBoundary queryOptions={getTodayMissionQueryOptions()}>
        <MissionCard />
      </ServerFetchBoundary>
      <PostList />
    </div>
  );
}
