'use client';

import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { useTranslations } from 'next-intl';
import { Trash2 } from 'lucide-react';
import { LikeButton } from '@/features/like/ui';
import { ShareButton } from '@/features/feed/share/ui';
import { FeedAuthor } from '@/features/feed/ui';
import { FeedDetailSkeleton, FeedDetailError } from '@/features/feed/detail/ui';
import { useGetFeedSuspenseQuery } from '@/features/feed/detail/api/useGetFeedQuery';
import { useDeleteFeedMutation } from '@/features/feed/delete/api/useDeleteFeedMutation';
import { useMeQuery } from '@/features/user/me/api/useMeQuery';
import { useRouter } from '@/app/i18n/navigation';
import {
  Badge,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  Button,
} from '@/shared/ui';
import { timeAgo } from '@/shared/lib/utils';

interface FeedDetailProps {
  id: number;
}

function FeedDetail({ id }: FeedDetailProps) {
  const t = useTranslations('feed');
  const { data: item } = useGetFeedSuspenseQuery(id);
  const { data: me } = useMeQuery();
  const router = useRouter();
  const { mutate: deleteFeed, isPending } = useDeleteFeedMutation();
  const isOwner = me?.id === item.owner.id;

  const handleDelete = () => {
    deleteFeed(item.id);
    setTimeout(() => router.push('/feed'), 500);
  };

  return (
    <article className="flex flex-col gap-3">
      {/* 작성자 정보 */}
      <div className="flex items-center justify-between">
        <FeedAuthor pet={item.pet} owner={item.owner} />
        {isOwner && (
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="mr-4 text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                disabled={isPending}
                aria-label={t('delete')}
              >
                <Trash2 size={18} />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('confirmDelete')}</DialogTitle>
                <DialogDescription>{t('deleteCannotUndo')}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogTrigger asChild>
                  <Button variant="outline">{t('cancel')}</Button>
                </DialogTrigger>
                <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                  {t('delete')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* 이미지 */}
      <Carousel className="w-full">
        <CarouselContent>
          {item.imageUrls.map((url, i) => (
            <CarouselItem key={i}>
              <div className="relative aspect-square max-h-[60svh] w-full bg-muted">
                <img
                  src={url}
                  alt={t('missionPhotoAlt', { petName: item.pet.name, index: i + 1 })}
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

        {/* 좋아요 / 공유 */}
        <div className="flex items-center gap-1">
          <LikeButton
            submissionId={item.id}
            initialLikeCount={item.likeCount}
            initialIsLiked={item.isLiked}
          />
          <ShareButton feedId={item.id} />
        </div>

        <div className="pb-2 text-xs text-muted-foreground">{timeAgo(item.createdAt)}</div>
      </div>
    </article>
  );
}

export default withErrorBoundary(withSuspense(FeedDetail, <FeedDetailSkeleton />), FeedDetailError);
