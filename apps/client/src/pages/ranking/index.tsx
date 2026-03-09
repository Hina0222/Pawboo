'use client';

import { Trophy, Medal } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { BottomNav } from '@/widgets/bottom-nav';

const MOCK_RANKINGS = [
  { rank: 1, nickname: '김집사', petName: '코코', petEmoji: '🐶', points: 3200 },
  { rank: 2, nickname: '이집사', petName: '나비', petEmoji: '🐱', points: 2850 },
  { rank: 3, nickname: '박집사', petName: '몽이', petEmoji: '🐶', points: 2610 },
  { rank: 4, nickname: '최집사', petName: '루나', petEmoji: '🐱', points: 2200 },
  { rank: 5, nickname: '정집사', petName: '두부', petEmoji: '🐶', points: 1980 },
  { rank: 6, nickname: '강집사', petName: '미미', petEmoji: '🐱', points: 1750 },
  { rank: 7, nickname: '윤집사', petName: '뽀삐', petEmoji: '🐶', points: 1540 },
  { rank: 8, nickname: '장집사', petName: '초코', petEmoji: '🐱', points: 1320 },
];

const MEDAL_COLOR = [
  'text-[oklch(0.85_0.18_85)]',
  'text-[oklch(0.78_0.01_250)]',
  'text-[oklch(0.68_0.12_50)]',
];

const PODIUM_GRAD = [
  'from-[oklch(0.45_0.14_80)] to-[oklch(0.35_0.10_85)]',
  'from-[oklch(0.38_0.02_250)] to-[oklch(0.30_0.01_250)]',
  'from-[oklch(0.40_0.10_50)] to-[oklch(0.32_0.08_50)]',
];

export default function RankingPage() {
  return (
    <div className="pb-20">
      <header className="px-5 pt-12 pb-6">
        <h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
          <Trophy size={22} className="text-[oklch(0.85_0.18_85)]" />
          이번 주 랭킹
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">미션 포인트 기준 · 매주 월요일 초기화</p>
      </header>

      {/* TOP 3 포디움 */}
      <section className="mb-6 px-5">
        <div className="flex items-end justify-center gap-3">
          <PodiumItem
            data={MOCK_RANKINGS[1]}
            grad={PODIUM_GRAD[1]}
            height="h-28"
            medal={MEDAL_COLOR[1]}
          />
          <PodiumItem
            data={MOCK_RANKINGS[0]}
            grad={PODIUM_GRAD[0]}
            height="h-36"
            medal={MEDAL_COLOR[0]}
            isFirst
          />
          <PodiumItem
            data={MOCK_RANKINGS[2]}
            grad={PODIUM_GRAD[2]}
            height="h-24"
            medal={MEDAL_COLOR[2]}
          />
        </div>
      </section>

      {/* 4위 이하 */}
      <section className="flex flex-col gap-2 px-5">
        {MOCK_RANKINGS.slice(3).map(item => (
          <div
            key={item.rank}
            className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3"
          >
            <span className="w-6 text-center text-sm font-bold text-muted-foreground">
              {item.rank}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[oklch(0.268_0.007_34.298)] text-xl">
              {item.petEmoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{item.petName}</p>
              <p className="text-xs text-muted-foreground">{item.nickname}</p>
            </div>
            <span className="text-sm font-bold text-[oklch(0.72_0.18_42)]">
              {item.points.toLocaleString()}P
            </span>
          </div>
        ))}
      </section>

      <BottomNav />
    </div>
  );
}

function PodiumItem({
  data,
  grad,
  height,
  medal,
  isFirst = false,
}: {
  data: (typeof MOCK_RANKINGS)[number];
  grad: string;
  height: string;
  medal: string;
  isFirst?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1">
      {isFirst && <Trophy size={14} className="text-[oklch(0.85_0.18_85)]" />}
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full border-2 bg-[oklch(0.268_0.007_34.298)] text-2xl',
          isFirst ? 'border-[oklch(0.85_0.18_85)]' : 'border-border'
        )}
      >
        {data.petEmoji}
      </div>
      <p className="w-full truncate text-center text-[11px] font-medium text-foreground">
        {data.petName}
      </p>
      <div
        className={cn(
          'flex w-full flex-col items-center justify-center gap-1 rounded-t-xl bg-gradient-to-b',
          height,
          grad
        )}
      >
        <Medal size={13} className={medal} />
        <span className="text-xs font-bold text-white">{data.rank}위</span>
        <span className="text-[10px] text-white/70">{(data.points / 1000).toFixed(1)}K</span>
      </div>
    </div>
  );
}
