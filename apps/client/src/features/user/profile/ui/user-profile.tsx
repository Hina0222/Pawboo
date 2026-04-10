'use client';

import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { FollowButton } from '@/features/follow/toggle/ui';
import { useGetUserProfileSuspenseQuery } from '../api/useGetUserProfileQuery';
import { UserProfileSkeleton } from './user-profile-skeleton';
import { UserProfileError } from './user-profile-error';
import { useTranslations } from 'next-intl';

interface UserProfileProps {
  userId: number;
}

function UserProfile({ userId }: UserProfileProps) {
  const t = useTranslations('profile');
  const { data: profile } = useGetUserProfileSuspenseQuery(userId);

  return (
    <section className="mt-4 px-5 pb-6">
      <div className="flex items-center gap-6">
        {/* 아바타 */}
        <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/40 bg-secondary text-4xl">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt={profile.nickname}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            '🐾'
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-1 gap-6">
          {[
            { label: t('followers'), value: profile.followerCount },
            { label: t('following'), value: profile.followingCount },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-lg font-bold text-foreground">{value}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 닉네임 + 팔로우 버튼 */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{profile.nickname}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{t('bio')}</p>
        </div>
        <FollowButton userId={userId} isFollowing={profile.isFollowing} />
      </div>
    </section>
  );
}

export default withErrorBoundary(
  withSuspense(UserProfile, <UserProfileSkeleton />),
  UserProfileError
);
