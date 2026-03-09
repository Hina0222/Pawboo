'use client';

import { Bell, Search, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/shared/ui';
import { BottomNav } from '@/widgets/bottom-nav';
import { useAuthStore } from '@/shared/store/auth-store';

const MOCK_MISSION = {
  title: '오늘의 산책 미션',
  description: '반려동물과 30분 이상 산책하고 인증 사진을 올려보세요',
  points: 150,
};

const MOCK_FEEDS = [
  {
    id: 1,
    petName: '코코',
    ownerName: '김집사',
    petEmoji: '🐶',
    imageEmoji: '🌳',
    imageBg: 'oklch(0.268 0.007 34.298)',
    likes: 42,
    comments: 8,
  },
  {
    id: 2,
    petName: '나비',
    ownerName: '이집사',
    petEmoji: '🐱',
    imageEmoji: '🌸',
    imageBg: 'oklch(0.22 0.006 320)',
    likes: 67,
    comments: 13,
  },
  {
    id: 3,
    petName: '몽이',
    ownerName: '박집사',
    petEmoji: '🐶',
    imageEmoji: '🎾',
    imageBg: 'oklch(0.22 0.01 200)',
    likes: 31,
    comments: 5,
  },
  {
    id: 4,
    petName: '루나',
    ownerName: '최집사',
    petEmoji: '🐱',
    imageEmoji: '🛋️',
    imageBg: 'oklch(0.20 0.008 260)',
    likes: 88,
    comments: 22,
  },
];

export default function HomePage() {
  const { user } = useAuthStore();

  return (
    <div className="pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background/80 px-5 pt-12 pb-4 backdrop-blur-sm">
        <h1 className="text-xl font-bold tracking-tight text-[oklch(0.72_0.18_42)]">BRAGram</h1>
        <div className="flex items-center gap-4">
          <button className="text-muted-foreground transition-colors hover:text-foreground">
            <Search size={22} />
          </button>
          <button className="relative text-muted-foreground transition-colors hover:text-foreground">
            <Bell size={22} />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[oklch(0.72_0.18_42)]" />
          </button>
        </div>
      </header>

      <main className="flex flex-col gap-6 px-5">
        {/* 오늘의 미션 카드 */}
        <section>
          <div
            className="relative overflow-hidden rounded-2xl p-5"
            style={{
              background:
                'linear-gradient(135deg, oklch(0.45 0.14 42) 0%, oklch(0.35 0.10 50) 100%)',
            }}
          >
            {/* 배경 장식 */}
            <div className="pointer-events-none absolute top-0 right-0 -mt-2 -mr-2 text-7xl leading-none opacity-20 select-none">
              🎯
            </div>

            <div className="relative">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white">
                  오늘의 미션
                </span>
                <span className="text-xs font-bold text-[oklch(0.95_0.15_80)]">
                  +{MOCK_MISSION.points}P
                </span>
              </div>
              <h2 className="mb-1.5 text-lg font-bold text-white">{MOCK_MISSION.title}</h2>
              <p className="mb-4 text-sm leading-relaxed text-white/75">
                {MOCK_MISSION.description}
              </p>
              <Button
                size="sm"
                className="rounded-xl bg-white px-5 font-semibold text-[oklch(0.45_0.14_42)] hover:bg-white/90"
              >
                참여하기
              </Button>
            </div>
          </div>
        </section>

        {/* 피드 */}
        <section className="flex flex-col gap-5">
          <h2 className="text-base font-semibold text-foreground">최근 게시물</h2>
          {MOCK_FEEDS.map(feed => (
            <FeedCard key={feed.id} feed={feed} />
          ))}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

function FeedCard({ feed }: { feed: (typeof MOCK_FEEDS)[number] }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      {/* 상단: 아바타 + 펫이름 + 집사명 */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[oklch(0.268_0.007_34.298)] text-xl">
          {feed.petEmoji}
        </div>
        <div className="flex flex-col">
          <span className="text-sm leading-tight font-semibold text-foreground">
            {feed.petName}
          </span>
          <span className="text-xs text-muted-foreground">{feed.ownerName}</span>
        </div>
        <button className="ml-auto text-muted-foreground">•••</button>
      </div>

      {/* 이미지 영역 (모의) */}
      <div
        className="flex aspect-square w-full items-center justify-center text-8xl"
        style={{ backgroundColor: feed.imageBg }}
      >
        {feed.imageEmoji}
      </div>

      {/* 하단: 액션 아이콘 */}
      <div className="flex items-center gap-4 px-4 py-3">
        <button className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-[oklch(0.72_0.18_42)]">
          <Heart size={20} />
          <span className="text-sm">{feed.likes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground">
          <MessageCircle size={20} />
          <span className="text-sm">{feed.comments}</span>
        </button>
        <button className="ml-auto text-muted-foreground transition-colors hover:text-foreground">
          <Share2 size={20} />
        </button>
      </div>
    </article>
  );
}
