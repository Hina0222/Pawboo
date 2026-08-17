'use client';

import { cn } from '@/shared/lib/cn';
import { useAddLikeMutation } from '../api/useAddLikeMutation';
import { useRemoveLikeMutation } from '../api/useRemoveLikeMutation';
import { patchLikeInCaches } from '../lib/patch-like-cache';
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
    // 낙관 반영 — 서버 응답 전에 숫자·색을 먼저 바꾸고, 실패 시 원복
    const before = { likeCount, isLiked };
    patchLikeInCaches(submissionId, {
      likeCount: likeCount + (isLiked ? -1 : 1),
      isLiked: !isLiked,
    });
    (isLiked ? removeLike : addLike)(submissionId, {
      onError: () => patchLikeInCaches(submissionId, before),
    });
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
