'use client';

import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { LikeButton } from '@/features/like/ui';
import { FeedAuthor } from '@/features/feed/ui';
import { FeedDetailSkeleton, FeedDetailError } from '@/features/feed/detail/ui';
import { useGetFeedSuspenseQuery } from '@/features/feed/detail/api/useGetFeedQuery';
import {
  Badge,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui';
import { timeAgo } from '@/shared/lib/utils';

interface FeedDetailProps {
  id: number;
}

function FeedDetail({ id }: FeedDetailProps) {
  const { data: item } = useGetFeedSuspenseQuery(id);

  return (
    <article className="flex flex-col gap-3">
      {/* 작성자 정보 */}
      <FeedAuthor pet={item.pet} owner={item.owner} />

      {/* 이미지 */}
      <Carousel className="w-full">
        <CarouselContent>
          {item.imageUrls.map((url, i) => (
            <CarouselItem key={i}>
              <div className="relative aspect-square max-h-[60svh] w-full bg-muted">
                <img
                  src={url}
                  alt={`${item.pet.name}의 미션 사진 ${i + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {item.imageUrls.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>

      <div className="space-y-1 px-4">
        {/* 제출 코멘트 */}
        {item.comment && <p className="text-sm text-foreground">{item.comment}</p>}

        {/* 미션 태그 + 해시태그 */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge>{item.missionTitle}</Badge>
          {item.hashtags?.map(tag => (
            <span key={tag} className="text-xs text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>

        {/* 좋아요 */}
        <div className="flex items-center gap-1">
          <LikeButton
            submissionId={item.id}
            initialLikeCount={item.likeCount}
            initialIsLiked={item.isLiked}
          />
        </div>

        <div className="pb-2 text-xs text-muted-foreground">{timeAgo(item.createdAt)}</div>
      </div>
    </article>
  );
}

export default withErrorBoundary(withSuspense(FeedDetail, <FeedDetailSkeleton />), FeedDetailError);
