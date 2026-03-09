'use client';

import { ChevronLeft, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/shared/ui';
import { useRouter } from 'next/navigation';

const MOCK_PET = {
  name: '코코',
  breed: '말티즈',
  emoji: '🐶',
  ownerName: '김집사',
  bio: '공원 산책을 좋아하는 4살 말티즈 🌿',
  posts: 24,
  followers: 128,
  following: 64,
};

const MOCK_POSTS = [
  { id: 1, emoji: '🌳', bg: 'oklch(0.268 0.007 34.298)' },
  { id: 2, emoji: '🎾', bg: 'oklch(0.22 0.01 200)' },
  { id: 3, emoji: '🛋️', bg: 'oklch(0.20 0.008 260)' },
  { id: 4, emoji: '🌸', bg: 'oklch(0.22 0.006 320)' },
  { id: 5, emoji: '🍖', bg: 'oklch(0.25 0.01 40)' },
  { id: 6, emoji: '🌙', bg: 'oklch(0.20 0.008 280)' },
];

// 서버 컴포넌트 params를 받는 구조 유지하되 클라이언트 UI로 전환
export default async function PetProfilePage({ params }: { params: Promise<{ petId: string }> }) {
  const { petId } = await params;
  return <PetProfileClient petId={petId} />;
}

function PetProfileClient({ petId: _petId }: { petId: string }) {
  const router = useRouter();

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
        <h1 className="text-base font-semibold text-foreground">{MOCK_PET.name}</h1>
      </header>

      {/* 프로필 */}
      <section className="px-5 pb-6">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-2 border-[oklch(0.72_0.18_42/40%)] bg-[oklch(0.268_0.007_34.298)] text-4xl">
            {MOCK_PET.emoji}
          </div>
          <div className="flex flex-1 gap-6">
            {[
              { label: '게시물', value: MOCK_PET.posts },
              { label: '팔로워', value: MOCK_PET.followers },
              { label: '팔로잉', value: MOCK_PET.following },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-lg font-bold text-foreground">{value}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold text-foreground">{MOCK_PET.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {MOCK_PET.breed} · {MOCK_PET.ownerName}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground">{MOCK_PET.bio}</p>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            size="sm"
            className="flex-1 rounded-xl bg-[oklch(0.72_0.18_42)] font-semibold text-[oklch(0.985_0.001_106.423)] hover:bg-[oklch(0.65_0.18_42)]"
          >
            팔로우
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 rounded-xl border-border font-semibold"
          >
            메시지
          </Button>
        </div>
      </section>

      {/* 게시물 그리드 */}
      <div className="border-t border-border">
        <div className="grid grid-cols-3 gap-0.5">
          {MOCK_POSTS.map(post => (
            <div
              key={post.id}
              className="flex aspect-square items-center justify-center text-4xl"
              style={{ backgroundColor: post.bg }}
            >
              {post.emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
