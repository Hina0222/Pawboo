'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import type { InfiniteData } from '@tanstack/react-query';
import type { PostListResponse } from '@pawboo/schemas/post';
import { Link } from '@/app/i18n/navigation';

interface PostGridListProps {
  data: InfiniteData<PostListResponse>;
  fetchNextPage: () => void;
  hasNextPage: boolean;
}

export function PostGridList({ data, fetchNextPage, hasNextPage }: PostGridListProps) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const posts = data.pages.flatMap(page => page.data);

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-sm">아직 포스트가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="grid grid-cols-3 gap-2">
        {posts.map(post => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="relative aspect-square overflow-hidden rounded-[10px]"
          >
            <img
              src={post.imageUrls[0]}
              alt="포스트 이미지"
              className="h-full w-full rounded-[10px] object-cover"
            />
          </Link>
        ))}
      </div>
      <div ref={ref} className="h-4" />
    </div>
  );
}
