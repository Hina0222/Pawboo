'use client';

import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { LikeButton } from '@/features/like/ui';
import { PostDetailSkeleton, PostDetailError } from '@/features/post/detail/ui';
import { useGetPostSuspenseQuery } from '@/features/post/detail/api/useGetPostQuery';
import { useGetPetsQuery } from '@/features/pet/list/api/useGetPetsQuery';
import { Carousel, CarouselContent, CarouselItem, ConfirmDialog } from '@/shared/ui';
import { useRouter } from '@/app/i18n/navigation';
import { useDeletePostMutation } from '@/features/post/delete/api/useDeletePostMutation';
import React from 'react';
import LogoIcon from '@/shared/assets/icons/LogoIcon.svg';

interface PostDetailProps {
  id: number;
  onDeleted?: () => void;
}

function PostDetail({ id, onDeleted }: PostDetailProps) {
  const { data: item } = useGetPostSuspenseQuery(id);
  const { data: pets } = useGetPetsQuery();
  const { mutate: deletePost, isPending } = useDeletePostMutation();
  const router = useRouter();

  const representativePetId = pets?.find(p => p.isRepresentative)?.id;
  const canDelete = representativePetId === item.pet.id;

  const handleDelete = () => {
    deletePost(id, {
      onSuccess: () => {
        if (onDeleted) onDeleted();
        else router.back();
      },
    });
  };

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
        <LikeButton submissionId={item.id} likeCount={item.likeCount} isLiked={item.isLiked} />
      </Carousel>

      <div
        className="flex cursor-pointer gap-x-2.5 rounded-full bg-[#333333CC] p-2 backdrop-blur-md"
        onClick={() => {
          router.push(`/pets/${item.pet.id}`);
        }}
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

export default withErrorBoundary(withSuspense(PostDetail, <PostDetailSkeleton />), PostDetailError);
