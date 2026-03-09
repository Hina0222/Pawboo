'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';
import { BottomNav } from '@/widgets/bottom-nav';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['전체', '산책', '식사', '케어', '놀이'] as const;

const MOCK_MISSIONS = [
  {
    id: 1,
    category: '산책',
    title: '30분 산책 인증',
    description: '반려동물과 30분 이상 산책하고 사진을 올려요',
    points: 150,
    emoji: '🚶',
    status: 'ongoing' as const,
    deadline: '오늘 자정까지',
  },
  {
    id: 2,
    category: '식사',
    title: '건강한 식사 인증',
    description: '오늘의 밥그릇 사진을 올려요',
    points: 80,
    emoji: '🍚',
    status: 'done' as const,
    deadline: null,
  },
  {
    id: 3,
    category: '케어',
    title: '브러싱 케어 인증',
    description: '털 빗기 또는 목욕 사진을 올려요',
    points: 120,
    emoji: '🪮',
    status: 'available' as const,
    deadline: '3일 남음',
  },
  {
    id: 4,
    category: '놀이',
    title: '장난감 놀이 인증',
    description: '장난감으로 노는 모습을 올려요',
    points: 100,
    emoji: '🎾',
    status: 'available' as const,
    deadline: '오늘 자정까지',
  },
  {
    id: 5,
    category: '산책',
    title: '공원 방문 인증',
    description: '공원에서 찍은 사진을 올려요',
    points: 200,
    emoji: '🌳',
    status: 'available' as const,
    deadline: '2일 남음',
  },
];

export default function MissionPage() {
  const [activeCategory, setActiveCategory] = useState<string>('전체');
  const router = useRouter();

  const filtered =
    activeCategory === '전체'
      ? MOCK_MISSIONS
      : MOCK_MISSIONS.filter(m => m.category === activeCategory);

  const totalPoints = MOCK_MISSIONS.filter(m => m.status === 'done').reduce(
    (acc, m) => acc + m.points,
    0
  );
  const doneCount = MOCK_MISSIONS.filter(m => m.status === 'done').length;

  return (
    <div className="pb-20">
      {/* 헤더 */}
      <header className="px-5 pt-12 pb-4">
        <h1 className="text-xl font-bold text-foreground">미션</h1>
      </header>

      {/* 오늘의 요약 카드 */}
      <section className="mb-5 px-5">
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, oklch(0.45 0.14 42) 0%, oklch(0.35 0.10 50) 100%)',
          }}
        >
          <p className="mb-1 text-xs text-white/70">오늘의 미션 달성</p>
          <div className="mb-3 flex items-end gap-3">
            <span className="text-3xl font-bold text-white">{doneCount}</span>
            <span className="mb-1 text-sm text-white/70">/ {MOCK_MISSIONS.length} 완료</span>
            <span className="ml-auto text-sm font-bold text-[oklch(0.95_0.15_80)]">
              +{totalPoints}P 획득
            </span>
          </div>
          {/* 진행 바 */}
          <div className="h-2 w-full rounded-full bg-white/20">
            <div
              className="h-2 rounded-full bg-white transition-all"
              style={{ width: `${(doneCount / MOCK_MISSIONS.length) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* 카테고리 필터 */}
      <div className="scrollbar-hide mb-4 flex gap-2 overflow-x-auto px-5 pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              activeCategory === cat
                ? 'bg-[oklch(0.72_0.18_42)] text-[oklch(0.985_0.001_106.423)]'
                : 'border border-border bg-card text-muted-foreground'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 미션 리스트 */}
      <section className="flex flex-col gap-3 px-5">
        {filtered.map(mission => (
          <div
            key={mission.id}
            className={cn(
              'rounded-2xl border p-4 transition-opacity',
              mission.status === 'done'
                ? 'border-border bg-card opacity-60'
                : 'border-border bg-card'
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[oklch(0.268_0.007_34.298)] text-2xl">
                {mission.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{mission.title}</p>
                  {mission.status === 'done' && (
                    <CheckCircle2 size={14} className="flex-shrink-0 text-[oklch(0.72_0.18_42)]" />
                  )}
                </div>
                <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
                  {mission.description}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[oklch(0.72_0.18_42)]">
                    +{mission.points}P
                  </span>
                  {mission.deadline && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={11} />
                      {mission.deadline}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {mission.status !== 'done' && (
              <Button
                size="sm"
                onClick={() => router.push('/mission/upload')}
                className="mt-3 w-full rounded-xl bg-[oklch(0.72_0.18_42)] text-xs font-semibold text-[oklch(0.985_0.001_106.423)] hover:bg-[oklch(0.65_0.18_42)]"
              >
                인증하기
              </Button>
            )}
          </div>
        ))}
      </section>

      {/* 히스토리 링크 */}
      <div className="mt-4 px-5">
        <button
          onClick={() => router.push('/mission/history')}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
        >
          <span className="text-sm text-muted-foreground">전체 미션 히스토리 보기</span>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
