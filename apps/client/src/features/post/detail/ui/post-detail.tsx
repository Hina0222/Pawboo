'use client';

import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { ImageOff } from 'lucide-react';
import { LikeButton } from '@/features/like/ui';
import { PostDetailSkeleton, PostDetailError } from '@/features/post/detail/ui';
import { useGetPostSuspenseQuery } from '@/features/post/detail/api/useGetPostQuery';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui';

interface PostDetailProps {
  id: number;
}

function PostDetail({ id }: PostDetailProps) {
  const { data: item } = useGetPostSuspenseQuery(id);

  return (
    <article className="flex flex-col items-center gap-2">
      <Carousel className="w-full">
        <CarouselContent>
          {item.imageUrls.map((url, i) => (
            <CarouselItem key={i}>
              <div className="relative aspect-square w-full overflow-hidden rounded-[30px]">
                <img
                  src={url}
                  alt={`${item.pet.name} ${i + 1}`}
                  className="h-full w-full rounded-[30px] object-cover"
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

      <div className="flex gap-x-2.5 rounded-full bg-[#333333CC] p-2 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="h-11 w-14 overflow-hidden rounded-full border border-[#F5F5F5]">
            {item.pet.imageUrl ? (
              <img
                src={item.pet.imageUrl}
                alt={item.pet.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageOff size={14} className="text-muted-foreground" />
              </div>
            )}
          </div>
          <span className="text-base font-medium text-[#E1E1E3]">{item.pet.name}</span>
        </div>

        <LikeButton
          submissionId={item.id}
          initialLikeCount={item.likeCount}
          initialIsLiked={item.isLiked}
        />
      </div>
    </article>
  );
}

export default withErrorBoundary(withSuspense(PostDetail, <PostDetailSkeleton />), PostDetailError);
