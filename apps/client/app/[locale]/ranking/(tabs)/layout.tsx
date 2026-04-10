import { BottomNav } from '@/widgets/bottom-nav';
import { TitleHeader } from '@/widgets/header';
import { RankingTabNav } from '@/widgets/header/ui/ranking-tab-nav';

export default function RankingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-20">
      <TitleHeader title="랭킹" />
      <RankingTabNav />
      {children}
      <BottomNav />
    </div>
  );
}
