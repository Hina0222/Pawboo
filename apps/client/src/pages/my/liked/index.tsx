import { Header } from '@/widgets/header';
import LikedPostFeed from './ui/liked-post-list';

export default function LikedPostsPage() {
  return (
    <div>
      <Header>
        <Header.Left>
          <Header.Back />
        </Header.Left>
        <Header.Center>
          <Header.Title>좋아요 목록</Header.Title>
        </Header.Center>
        <Header.Right />
      </Header>

      <LikedPostFeed />
    </div>
  );
}
