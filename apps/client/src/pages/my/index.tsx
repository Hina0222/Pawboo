'use client';

import { Settings } from 'lucide-react';
import { Link } from '@/app/i18n/navigation';
import { BottomNav } from '@/widgets/bottom-nav';
import { useMeQuery } from '@/features/user/me/api/useMeQuery';
import { UserFeedGrid } from '@/features/feed/user-feed/ui';
import { MyPetList } from '@/widgets/pet';
import { TitleHeader } from '@/widgets/header';
import { useTranslations } from 'next-intl';

export default function MyPage() {
  const { data: user } = useMeQuery();
  const t = useTranslations('my');

  const displayName = user?.nickname ?? t('defaultNickname');

  return (
    <div className="pb-20">
      <TitleHeader
        title={t('title')}
        right={
          <Link
            href="/my/settings"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Settings size={22} />
          </Link>
        }
      />

      {/* 프로필 섹션 */}
      <section className="mt-4 px-5 pb-6">
        <div className="flex items-center gap-6">
          {/* 아바타 */}
          <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/40 bg-secondary text-4xl">
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
              { label: t('followers'), value: user?.followerCount ?? 0 },
              { label: t('following'), value: user?.followingCount ?? 0 },
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
          <p className="mt-0.5 text-xs text-muted-foreground">{t('tagline')}</p>
        </div>
      </section>

      {/* 내 펫 가로 스크롤 */}
      <section className="px-5 pb-6">
        <h2 className="mb-3 text-sm font-semibold text-foreground">{t('myPets')}</h2>
        <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-1">
          <MyPetList />
          <Link href="/my/pets/new" className="flex flex-shrink-0 flex-col items-center gap-1.5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-border bg-card text-muted-foreground transition-colors hover:border-primary/50">
              <span className="text-xl">+</span>
            </div>
            <span className="text-xs text-muted-foreground">{t('add')}</span>
          </Link>
        </div>
      </section>

      {user && <UserFeedGrid userId={user.id} />}

      <BottomNav />
    </div>
  );
}
