'use client';

import { useFollowMutation } from '../api/useFollowMutation';
import { useUnfollowMutation } from '../api/useUnfollowMutation';

interface FollowButtonProps {
  userId: number;
  isFollowing: boolean;
}

export function FollowButton({ userId, isFollowing }: FollowButtonProps) {
  const { mutate: follow, isPending: isFollowPending } = useFollowMutation(userId);
  const { mutate: unfollow, isPending: isUnfollowing } = useUnfollowMutation(userId);

  const isPending = isFollowPending || isUnfollowing;

  const handleClick = () => {
    if (isFollowing) {
      unfollow(userId);
    } else {
      follow(userId);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={
        isFollowing
          ? 'rounded-lg border border-border px-5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50'
          : 'rounded-lg bg-[oklch(0.72_0.18_42)] px-5 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50'
      }
    >
      {isFollowing ? '팔로잉' : '팔로우'}
    </button>
  );
}
