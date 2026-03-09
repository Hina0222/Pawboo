'use client';

import { Search, Heart, MessageCircle, Share2 } from 'lucide-react';
import { BottomNav } from '@/widgets/bottom-nav';
import { useRouter } from 'next/navigation';

const MOCK_POPULAR_PETS = [
  { id: '1', name: '코코', emoji: '🐶' },
  { id: '2', name: '나비', emoji: '🐱' },
  { id: '3', name: '몽이', emoji: '🐶' },
  { id: '4', name: '루나', emoji: '🐱' },
  { id: '5', name: '두부', emoji: '🐶' },
];

const MOCK_FEEDS = [
  {
    id: 1,
    petId: '1',
    petName: '코코',
    ownerName: '김집사',
    petEmoji: '🐶',
    imageEmoji: '🌳',
    imageBg: 'oklch(0.268 0.007 34.298)',
    caption: '오늘도 공원 산책 완료! 🌿 바람이 너무 좋았다냥',
    likes: 42,
    comments: 8,
    timeAgo: '2시간 전',
  },
  {
    id: 2,
    petId: '2',
    petName: '나비',
    ownerName: '이집사',
    petEmoji: '🐱',
    imageEmoji: '🌸',
    imageBg: 'oklch(0.22 0.006 320)',
    caption: '봄이 와서 기분 좋아🌸 낮잠 중 깜짝 카메라',
    likes: 67,
    comments: 13,
    timeAgo: '4시간 전',
  },
  {
    id: 3,
    petId: '3',
    petName: '몽이',
    ownerName: '박집사',
    petEmoji: '🐶',
    imageEmoji: '🎾',
    imageBg: 'oklch(0.22 0.01 200)',
    caption: '공 물어오는 거 10번 성공! 최고의 강아지🏆',
    likes: 31,
    comments: 5,
    timeAgo: '6시간 전',
  },
];

export default function CommunityPage() {
  const router = useRouter();

  return (
    <div className="pb-20">
      {/* 헤더 */}
      <header className="px-5 pt-12 pb-4">
        <h1 className="mb-3 text-xl font-bold text-foreground">커뮤니티</h1>
        {/* 검색 바 */}
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
          <Search size={16} className="flex-shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="반려동물 이름으로 검색..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </header>

      {/* 인기 펫 가로 스크롤 */}
      <section className="mb-5">
        <h2 className="mb-3 px-5 text-sm font-semibold text-foreground">지금 인기 있는 펫 🔥</h2>
        <div className="scrollbar-hide flex gap-4 overflow-x-auto px-5 pb-1">
          {MOCK_POPULAR_PETS.map(pet => (
            <button
              key={pet.id}
              onClick={() => router.push(`/community/${pet.id}`)}
              className="flex flex-shrink-0 flex-col items-center gap-1.5"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[oklch(0.72_0.18_42/50%)] bg-card text-2xl">
                {pet.emoji}
              </div>
              <span className="text-xs text-muted-foreground">{pet.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 피드 */}
      <section className="flex flex-col gap-5 px-5">
        {MOCK_FEEDS.map(feed => (
          <article
            key={feed.id}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            {/* 상단 */}
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                onClick={() => router.push(`/community/${feed.petId}`)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[oklch(0.268_0.007_34.298)] text-xl"
              >
                {feed.petEmoji}
              </button>
              <div className="flex flex-col">
                <span className="text-sm leading-tight font-semibold text-foreground">
                  {feed.petName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {feed.ownerName} · {feed.timeAgo}
                </span>
              </div>
              <button className="ml-auto text-muted-foreground">•••</button>
            </div>

            {/* 이미지 */}
            <div
              className="flex aspect-square w-full items-center justify-center text-8xl"
              style={{ backgroundColor: feed.imageBg }}
            >
              {feed.imageEmoji}
            </div>

            {/* 액션 */}
            <div className="flex items-center gap-4 px-4 pt-3 pb-1">
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

            {/* 캡션 */}
            <p className="px-4 pt-1.5 pb-4 text-sm leading-relaxed text-foreground">
              <span className="mr-1 font-semibold">{feed.petName}</span>
              {feed.caption}
            </p>
          </article>
        ))}
      </section>

      <BottomNav />
    </div>
  );
}
