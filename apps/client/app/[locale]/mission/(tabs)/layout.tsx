import { TitleHeader, MissionTabNav } from '@/widgets/header';
import { BottomNav } from '@/widgets/bottom-nav';

export default function MissionTabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-20">
      <TitleHeader title="미션" />
      <MissionTabNav />
      {children}
      <BottomNav />
    </div>
  );
}
