'use client';

import { Settings } from 'lucide-react';
import Link from 'next/link';
import { BottomNav } from '@/widgets/bottom-nav';
import { useAuthStore } from '@/shared/store/auth-store';
import { UserFeedGrid } from '@/features/feed/user-feed/ui';
import { MyPetList } from '@/widgets/pet';

export default function MyPage() {
  const { user } = useAuthStore();

  const displayName = user?.nickname ?? '집사님';

  return (
    <div className="pb-20">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4">
        <h1 className="text-base font-semibold text-foreground">{displayName}</h1>
        <Link
          href="/my/settings"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <Settings size={22} />
        </Link>
      </header>

      {/* 프로필 섹션 */}
      <section className="px-5 pb-6">
        <div className="flex items-center gap-6">
          {/* 아바타 */}
          <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[oklch(0.72_0.18_42/40%)] bg-[oklch(0.268_0.007_34.298)] text-4xl">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={displayName}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              '🐾'
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-1 gap-6">
            {[
              { label: '팔로워', value: user?.followerCount ?? 0 },
              { label: '팔로잉', value: user?.followingCount ?? 0 },
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
          <MyPetList />
          <Link href="/my/pets/new" className="flex flex-shrink-0 flex-col items-center gap-1.5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-border bg-card text-muted-foreground transition-colors hover:border-[oklch(0.72_0.18_42/50%)]">
              <span className="text-xl">+</span>
            </div>
            <span className="text-xs text-muted-foreground">추가</span>
          </Link>
        </div>
      </section>

      {user && <UserFeedGrid userId={user.id} />}

      <BottomNav />
    </div>
  );
}
