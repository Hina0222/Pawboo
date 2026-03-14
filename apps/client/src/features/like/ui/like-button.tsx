'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import { useAddLikeMutation } from '../add/api/useAddLikeMutation';
import { useRemoveLikeMutation } from '../remove/api/useRemoveLikeMutation';

interface LikeButtonProps {
  submissionId: number;
  initialLikeCount: number;
  initialIsLiked: boolean;
}

export function LikeButton({ submissionId, initialLikeCount, initialIsLiked }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const { mutate: addLike, isPending: isAdding } = useAddLikeMutation();
  const { mutate: removeLike, isPending: isRemoving } = useRemoveLikeMutation();

  const isPending = isAdding || isRemoving;

  const handleClick = () => {
    if (isLiked) {
      removeLike(submissionId, {
        onSuccess: data => {
          setIsLiked(data.isLiked);
          setLikeCount(data.likeCount);
        },
      });
    } else {
      addLike(submissionId, {
        onSuccess: data => {
          setIsLiked(data.isLiked);
          setLikeCount(data.likeCount);
        },
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={handleClick}
      disabled={isPending}
      className="gap-1.5 px-2"
    >
      <Heart
        size={16}
        className={cn('transition-colors', isLiked && 'fill-red-500 text-red-500')}
      />
      <span className="text-xs text-muted-foreground">{likeCount}</span>
    </Button>
  );
}
