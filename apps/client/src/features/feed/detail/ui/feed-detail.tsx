'use client';

import Image from 'next/image';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { LikeButton } from '@/features/like/ui';
import { FeedAuthor } from '@/features/feed/ui';
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
      <FeedAuthor pet={item.pet} owner={item.owner} createdAt={item.createdAt} />

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
