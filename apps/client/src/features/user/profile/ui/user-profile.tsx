'use client';

import Image from 'next/image';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { FollowButton } from '@/features/follow/toggle/ui';
import { useGetUserProfileSuspenseQuery } from '../api/useGetUserProfileQuery';
import { UserProfileSkeleton } from './user-profile-skeleton';
import { UserProfileError } from './user-profile-error';

interface UserProfileProps {
  userId: number;
}

function UserProfile({ userId }: UserProfileProps) {
  const { data: profile } = useGetUserProfileSuspenseQuery(userId);

  return (
    <section className="px-5 pb-6">
      <div className="flex items-center gap-6">
        {/* 아바타 */}
        <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[oklch(0.72_0.18_42/40%)] bg-[oklch(0.268_0.007_34.298)] text-4xl">
          {profile.profileImage ? (
            <Image
              src={profile.profileImage}
              alt={profile.nickname}
              fill
              className="object-cover"
            />
          ) : (
            '🐾'
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-1 gap-6">
          {[
            { label: '팔로워', value: profile.followerCount },
            { label: '팔로잉', value: profile.followingCount },
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
          <p className="mt-0.5 text-xs text-muted-foreground">반려동물과 함께하는 일상 🐾</p>
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
