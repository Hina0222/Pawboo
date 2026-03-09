'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { BottomNav } from '@/widgets/bottom-nav';
import { useAuthStore } from '@/shared/store/auth-store';

const MOCK_PETS = [
  { id: 1, name: '코코', emoji: '🐶' },
  { id: 2, name: '나비', emoji: '🐱' },
];

const MOCK_POSTS = [
  { id: 1, emoji: '🌳', bg: 'oklch(0.268 0.007 34.298)' },
  { id: 2, emoji: '🎾', bg: 'oklch(0.22 0.01 200)' },
  { id: 3, emoji: '🌸', bg: 'oklch(0.22 0.006 320)' },
  { id: 4, emoji: '🛋️', bg: 'oklch(0.20 0.008 260)' },
  { id: 5, emoji: '🌙', bg: 'oklch(0.20 0.008 280)' },
  { id: 6, emoji: '🍖', bg: 'oklch(0.25 0.01 40)' },
];

const MOCK_MISSIONS = [
  { id: 1, title: '산책 미션 완료', date: '2026.03.09', points: 150, emoji: '🚶' },
  { id: 2, title: '간식 만들기 미션', date: '2026.03.07', points: 200, emoji: '🍪' },
  { id: 3, title: '목욕 인증 미션', date: '2026.03.05', points: 100, emoji: '🛁' },
];

type Tab = 'posts' | 'missions';

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const { user } = useAuthStore();

  const displayName = user?.nickname ?? '집사님';

  return (
    <div className="pb-20">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4">
        <h1 className="text-base font-semibold text-foreground">{displayName}</h1>
        <button className="text-muted-foreground transition-colors hover:text-foreground">
          <Settings size={22} />
        </button>
      </header>

      {/* 프로필 섹션 */}
      <section className="px-5 pb-6">
        <div className="flex items-center gap-6">
          {/* 아바타 */}
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-2 border-[oklch(0.72_0.18_42/40%)] bg-[oklch(0.268_0.007_34.298)] text-4xl">
            🐾
          </div>

          {/* Stats */}
          <div className="flex flex-1 gap-6">
            {[
              { label: '게시물', value: MOCK_POSTS.length },
              { label: '팔로워', value: '128' },
              { label: '팔로잉', value: '64' },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-lg font-bold text-foreground">{value}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 닉네임 */}
        <div className="mt-4">
          <p className="text-sm font-semibold text-foreground">{displayName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">반려동물과 함께하는 일상 🐾</p>
        </div>
      </section>

      {/* 내 펫 가로 스크롤 */}
      <section className="px-5 pb-6">
        <h2 className="mb-3 text-sm font-semibold text-foreground">내 반려동물</h2>
        <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-1">
          {MOCK_PETS.map(pet => (
            <div key={pet.id} className="flex flex-shrink-0 flex-col items-center gap-1.5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[oklch(0.72_0.18_42/50%)] bg-card text-2xl">
                {pet.emoji}
              </div>
              <span className="text-xs text-muted-foreground">{pet.name}</span>
            </div>
          ))}
          {/* 펫 추가 버튼 */}
          <div className="flex flex-shrink-0 flex-col items-center gap-1.5">
            <button className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-border bg-card text-muted-foreground transition-colors hover:border-[oklch(0.72_0.18_42/50%)]">
              <span className="text-xl">+</span>
            </button>
            <span className="text-xs text-muted-foreground">추가</span>
          </div>
        </div>
      </section>

      {/* 탭 */}
      <div className="border-t border-border">
        <div className="flex">
          {(
            [
              { key: 'posts' as Tab, label: '게시물' },
              { key: 'missions' as Tab, label: '미션 히스토리' },
            ] as { key: Tab; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                'flex-1 border-b-2 py-3 text-sm font-medium transition-colors',
                activeTab === key
                  ? 'border-[oklch(0.72_0.18_42)] text-[oklch(0.72_0.18_42)]'
                  : 'border-transparent text-muted-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'posts' ? (
        <section className="grid grid-cols-3 gap-0.5">
          {MOCK_POSTS.map(post => (
            <div
              key={post.id}
              className="flex aspect-square items-center justify-center text-4xl"
              style={{ backgroundColor: post.bg }}
            >
              {post.emoji}
            </div>
          ))}
        </section>
      ) : (
        <section className="flex flex-col gap-3 px-5 py-4">
          {MOCK_MISSIONS.map(mission => (
            <div
              key={mission.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[oklch(0.72_0.18_42/12%)] text-xl">
                {mission.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{mission.title}</p>
                <p className="text-xs text-muted-foreground">{mission.date}</p>
              </div>
              <span className="flex-shrink-0 text-sm font-bold text-[oklch(0.72_0.18_42)]">
                +{mission.points}P
              </span>
            </div>
          ))}
        </section>
      )}

      <BottomNav />
    </div>
  );
}
