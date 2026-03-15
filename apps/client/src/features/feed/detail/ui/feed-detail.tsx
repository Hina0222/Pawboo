'use client';

import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { LikeButton } from '@/features/like/ui';
import { FeedDetailSkeleton, FeedDetailError } from '@/features/feed/detail/ui';
import { useGetFeedSuspenseQuery } from '@/features/feed/detail/api/useGetFeedQuery';

interface FeedDetailProps {
  id: number;
}

function FeedDetail({ id }: FeedDetailProps) {
  const { data: item } = useGetFeedSuspenseQuery(id);

  return (
    <article className="flex flex-col gap-3 border-b border-border pb-4">
      {/* 작성자 정보 */}
      <div className="flex items-center gap-2 px-5">
        <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-muted">
          {item.pet.imageUrl ? (
            <Image
              src={item.pet.imageUrl}
              alt={item.pet.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageOff size={14} className="text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{item.pet.name}</span>
          <span className="text-xs text-muted-foreground">{item.owner.nickname}</span>
        </div>
        <span className="ml-auto text-xs text-muted-foreground">
          {new Date(item.createdAt).toLocaleDateString('ko-KR')}
        </span>
      </div>

      {/* 이미지 */}
      <div className="relative aspect-square w-full bg-muted">
        <Image
          src={item.imageUrl}
          alt={`${item.pet.name}의 미션 사진`}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* 미션 태그 + 해시태그 */}
      <div className="flex flex-wrap items-center gap-1.5 px-5">
        <span className="rounded-full bg-[oklch(0.72_0.18_42/15%)] px-2.5 py-0.5 text-xs text-primary">
          {item.missionTitle}
        </span>
        {item.hashtags?.map(tag => (
          <span key={tag} className="text-xs text-muted-foreground">
            #{tag}
          </span>
        ))}
      </div>

      {/* 좋아요 */}
      <div className="flex items-center gap-1 px-4">
        <LikeButton
          submissionId={item.id}
          initialLikeCount={item.likeCount}
          initialIsLiked={item.isLiked}
        />
      </div>
    </article>
  );
}

export default withErrorBoundary(withSuspense(FeedDetail, <FeedDetailSkeleton />), FeedDetailError);
