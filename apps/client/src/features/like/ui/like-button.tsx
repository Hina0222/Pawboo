'use client';

import { cn } from '@/shared/lib/utils';
import { useAddLikeMutation } from '../add/api/useAddLikeMutation';
import { useRemoveLikeMutation } from '../remove/api/useRemoveLikeMutation';
import LogoIcon from '@/shared/assets/icons/LogoIcon.svg';

interface LikeButtonProps {
  submissionId: number;
  likeCount: number;
  isLiked: boolean;
}

export function LikeButton({ submissionId, likeCount, isLiked }: LikeButtonProps) {
  const { mutate: addLike, isPending: isAdding } = useAddLikeMutation();
  const { mutate: removeLike, isPending: isRemoving } = useRemoveLikeMutation();

  const isPending = isAdding || isRemoving;

  const handleClick = () => {
    if (isLiked) {
      removeLike(submissionId);
    } else {
      addLike(submissionId);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        'absolute right-3 bottom-3 flex items-center justify-center gap-x-1 rounded-full bg-[#4D4D4D80] p-3 transition-colors',
        isLiked && 'text-[#FADF78]'
      )}
    >
      <LogoIcon className="h-5 w-5" />
      <span className="text-xs font-medium">{likeCount}</span>
    </button>
  );
}
