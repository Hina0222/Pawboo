'use client';

import { LikeButton } from '@/features/like/ui';
import { useGetPetsQuery } from '@/features/pet/list/api/useGetPetsQuery';
import { useDeletePostMutation } from '@/features/post/delete/api/useDeletePostMutation';
import { Carousel, CarouselContent, CarouselItem, ConfirmDialog } from '@/shared/ui';
import { CarouselApi } from '@/shared/ui/carousel';
import React, { useEffect, useState } from 'react';
import type { PostDetail } from '@pawboo/schemas/post';
import { cn } from '@/shared/lib/cn';

interface CalendarPostDetailProps {
  posts: PostDetail[];
  onDeleted?: () => void;
}

export function CalendarPostDetail({ posts, onDeleted }: CalendarPostDetailProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  const { data: pets } = useGetPetsQuery();
  const { mutate: deletePost, isPending } = useDeletePostMutation();

  const currentPost = posts[current];
  const representativePetId = pets?.find(p => p.isRepresentative)?.id;
  const canDelete = representativePetId === currentPost.pet.id;

  const handleDelete = () => {
    deletePost(currentPost.id, { onSuccess: () => onDeleted?.() });
  };

  useEffect(() => {
    if (!api) return;

    const update = () => {
      setCurrent(api.selectedScrollSnap());
    };

    update();
    api.on('select', update);

    return () => {
      api.off('select', update);
    };
  }, [api]);

  return (
    <article className="flex flex-col items-center gap-2">
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent>
          {posts.map((post, i) => (
            <CarouselItem key={post.id}>
              <div className="relative aspect-square w-full overflow-hidden rounded-[30px]">
                <img
                  src={post.imageUrls[0]}
                  alt={`${post.pet.name} ${i + 1}`}
                  className="h-full w-full rounded-[30px] object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {posts.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {posts.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full',
                  i === current ? 'h-3 w-3 bg-white' : 'h-2 w-2 bg-[#E1E1E3] opacity-40'
                )}
              />
            ))}
          </div>
        )}
        <LikeButton
          key={currentPost.id}
          postId={currentPost.id}
          likeCount={currentPost.likeCount}
          isLiked={currentPost.isLiked}
        />
      </Carousel>

      <div className="flex gap-2 overflow-x-auto">
        {posts.map((post, i) => (
          <div
            key={post.id}
            className={cn(
              'rounded-[8px] border',
              i === current ? 'bg-[#FFFFFF]' : 'bg-transparent'
            )}
            onClick={() => api?.scrollTo(i)}
          >
            <img src={post.imageUrls[0]} alt="" className="h-18 w-18 rounded-[8px] object-cover" />
          </div>
        ))}
      </div>

      {canDelete && (
        <ConfirmDialog
          title={'정말 삭제 하겠습니까?'}
          isPending={isPending}
          onConfirm={handleDelete}
          trigger={
            <button className="absolute bottom-10 font-medium text-[#E1E1E3] underline disabled:opacity-50">
              삭제하기
            </button>
          }
        />
      )}
    </article>
  );
}
