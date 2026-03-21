import { MissionHistory } from '@/features/mission/history/ui';

export default async function MissionHistoryPage() {
  return (
    <section className="flex flex-col gap-5 px-5">
      <MissionHistory />
    </section>
  );
}
