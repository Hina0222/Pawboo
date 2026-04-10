'use client';

import { memo } from 'react';
import { Link } from '@/app/i18n/navigation';
import { MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LikeButton } from '@/features/like/ui';
import { ShareButton } from '@/features/feed/share/ui';
import { FeedAuthor } from '@/features/feed/ui';
import type { FeedItem as FeedItemType } from '@bragram/schemas/feed';
import {
  Badge,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui';
import { timeAgo } from '@/shared/lib/utils';

interface FeedItemProps {
  item: FeedItemType;
}

export const FeedItem = memo(function FeedItem({ item }: FeedItemProps) {
  const t = useTranslations('feed');
  return (
    <article className="overflow-hidden rounded-2xl bg-card shadow-sm">
      {/* 작성자 정보 */}
      <FeedAuthor pet={item.pet} owner={item.owner} />

      {/* 이미지 */}
      <Carousel className="w-full">
        <CarouselContent>
          {item.imageUrls.map((url, i) => (
            <CarouselItem key={i}>
              <div className="relative aspect-square w-full bg-muted">
                <img
                  src={url}
                  alt={t('missionPhotoAlt', { petName: item.pet.name, index: i + 1 })}
                  className="h-full w-full object-cover"
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

      {/* 좋아요 / 댓글 / 공유 */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-1">
          <LikeButton
            submissionId={item.id}
            initialLikeCount={item.likeCount}
            initialIsLiked={item.isLiked}
          />
          <Link
            href={`/feed/${item.id}`}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
          >
            <MessageCircle size={16} />
            <span>{item.commentCount}</span>
          </Link>
        </div>
        <ShareButton feedId={item.id} />
      </div>

      {/* 제출 코멘트 */}
      {item.comment && <p className="px-4 pb-2 text-xs text-foreground">{item.comment}</p>}

      {/* 미션 태그 + 해시태그 */}
      <div className="flex flex-wrap items-center gap-1.5 px-4 pb-2">
        <Badge className="border-transparent bg-primary/10 text-[10px] font-bold tracking-wider text-primary uppercase">
          {item.missionTitle}
        </Badge>
        {item.hashtags?.map(tag => (
          <span key={tag} className="text-xs text-muted-foreground">
            #{tag}
          </span>
        ))}
      </div>

      <div className="px-4 pb-2 text-xs text-muted-foreground">{timeAgo(item.createdAt)}</div>
    </article>
  );
});
