import { BackHeader } from '@/widgets/header';
import { MissionHistory } from '@/features/mission/history/ui';

export default function MissionHistoryPage() {
  return (
    <div className="pb-20">
      <BackHeader title="미션 히스토리" />

      {/* 총 획득 포인트 */}

      <section className="flex flex-col gap-5 px-5">
        <MissionHistory />
      </section>
    </div>
  );
}
