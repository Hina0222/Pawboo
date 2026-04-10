'use client';

import { Button } from '@/shared/ui/button';
import { useFollowMutation } from '../api/useFollowMutation';
import { useUnfollowMutation } from '../api/useUnfollowMutation';
import { useTranslations } from 'next-intl';

interface FollowButtonProps {
  userId: number;
  isFollowing: boolean;
}

export function FollowButton({ userId, isFollowing }: FollowButtonProps) {
  const t = useTranslations('follow');
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
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-lg px-5"
    >
      {isFollowing ? t('following') : t('follow')}
    </Button>
  );
}
