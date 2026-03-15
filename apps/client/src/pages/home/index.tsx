import { BottomNav } from '@/widgets/bottom-nav';
import { TitleHeader } from '@/widgets/header';
import { FeedList } from '@/features/feed/list/ui';

export default function HomePage() {
  return (
    <div className="pb-20">
      <TitleHeader title="홈" />
      <FeedList />
      <BottomNav />
    </div>
  );
}
