'use client';

import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { LikeButton } from '@/features/like/ui';
import { PostDetailSkeleton, PostDetailError } from '@/features/post/detail/ui';
import { useGetPostSuspenseQuery } from '@/features/post/detail/api/useGetPostQuery';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui';
import { useRouter } from '@/app/i18n/navigation';
import { useDeletePostMutation } from '@/features/post/delete/api/useDeletePostMutation';
import { CarouselApi } from '@/shared/ui/carousel';
import React, { useEffect, useState } from 'react';
import LogoIcon from '@/shared/assets/icons/LogoIcon.svg';

interface PostDetailProps {
  id: number;
}

function PostDetail({ id }: PostDetailProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const { data: item } = useGetPostSuspenseQuery(id);
  const { mutate: deletePost, isPending } = useDeletePostMutation();
  const router = useRouter();

  const handleDelete = () => {
    deletePost(id, { onSuccess: () => router.back() });
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
    <article className="flex flex-col items-center gap-4">
      <Carousel className="w-full" setApi={setApi} onClick={e => e.stopPropagation()}>
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
          <span className="absolute right-3 bottom-3 rounded-full bg-[#333333CC] px-4 py-3.5 text-xs font-medium text-[#E1E1E3]">
            {current + 1} / {item.imageUrls.length}
          </span>
        )}
      </Carousel>

      <div
        className="flex gap-x-2.5 rounded-full bg-[#333333CC] p-2 backdrop-blur-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <div className="h-11 w-14 overflow-hidden rounded-full border border-[#F5F5F5]">
            {item.pet.imageUrl ? (
              <img
                src={item.pet.imageUrl}
                alt={item.pet.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#FADF78]">
                <LogoIcon className="h-5 w-5 text-[#C59D07]" />
              </div>
            )}
          </div>
          <span className="font-medium text-[#E1E1E3]">{item.pet.name}</span>
        </div>

        <LikeButton
          submissionId={item.id}
          initialLikeCount={item.likeCount}
          initialIsLiked={item.isLiked}
        />
      </div>

      <button
        onClick={e => {
          e.stopPropagation();
          handleDelete();
        }}
        disabled={isPending}
        className="mt-2 font-medium text-[#E1E1E3] underline disabled:opacity-50"
      >
        {isPending ? '삭제 중...' : '삭제하기'}
      </button>
    </article>
  );
}

export default withErrorBoundary(withSuspense(PostDetail, <PostDetailSkeleton />), PostDetailError);
