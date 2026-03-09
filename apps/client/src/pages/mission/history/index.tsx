'use client';

import { ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';

const MOCK_HISTORY = [
  {
    id: 1,
    date: '2026.03.09',
    missions: [
      { id: 11, title: '30분 산책 인증', emoji: '🚶', points: 150, done: true },
      { id: 12, title: '건강한 식사 인증', emoji: '🍚', points: 80, done: true },
      { id: 13, title: '장난감 놀이 인증', emoji: '🎾', points: 100, done: false },
    ],
  },
  {
    id: 2,
    date: '2026.03.08',
    missions: [
      { id: 21, title: '30분 산책 인증', emoji: '🚶', points: 150, done: true },
      { id: 22, title: '브러싱 케어 인증', emoji: '🪮', points: 120, done: true },
      { id: 23, title: '건강한 식사 인증', emoji: '🍚', points: 80, done: true },
    ],
  },
  {
    id: 3,
    date: '2026.03.07',
    missions: [
      { id: 31, title: '간식 만들기 미션', emoji: '🍪', points: 200, done: true },
      { id: 32, title: '공원 방문 인증', emoji: '🌳', points: 200, done: false },
    ],
  },
];

export default function MissionHistoryPage() {
  const router = useRouter();

  const totalEarned = MOCK_HISTORY.flatMap(g => g.missions)
    .filter(m => m.done)
    .reduce((acc, m) => acc + m.points, 0);

  return (
    <div className="pb-20">
      {/* 헤더 */}
      <header className="flex items-center gap-3 px-5 pt-12 pb-4">
        <button
          onClick={() => router.back()}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-base font-semibold text-foreground">미션 히스토리</h1>
      </header>

      {/* 총 획득 포인트 */}
      <section className="mb-5 px-5">
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, oklch(0.45 0.14 42) 0%, oklch(0.35 0.10 50) 100%)',
          }}
        >
          <p className="mb-1 text-xs text-white/70">총 획득 포인트</p>
          <p className="text-3xl font-bold text-white">
            {totalEarned.toLocaleString()}
            <span className="ml-1 text-base font-normal text-white/80">P</span>
          </p>
        </div>
      </section>

      {/* 날짜별 그룹 */}
      <section className="flex flex-col gap-5 px-5">
        {MOCK_HISTORY.map(group => {
          const dayPoints = group.missions
            .filter(m => m.done)
            .reduce((acc, m) => acc + m.points, 0);

          return (
            <div key={group.id}>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{group.date}</p>
                <span className="text-xs font-bold text-[oklch(0.72_0.18_42)]">+{dayPoints}P</span>
              </div>
              <div className="flex flex-col gap-2">
                {group.missions.map(m => (
                  <div
                    key={m.id}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3',
                      !m.done && 'opacity-50'
                    )}
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[oklch(0.268_0.007_34.298)] text-lg">
                      {m.emoji}
                    </div>
                    <p className="flex-1 text-sm text-foreground">{m.title}</p>
                    {m.done ? (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 size={14} className="text-[oklch(0.72_0.18_42)]" />
                        <span className="text-xs font-bold text-[oklch(0.72_0.18_42)]">
                          +{m.points}P
                        </span>
                      </div>
                    ) : (
                      <XCircle size={14} className="text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
