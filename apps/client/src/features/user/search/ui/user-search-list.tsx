'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { useSearchUsersSuspenseInfiniteQuery } from '../api/useSearchUsersInfiniteQuery';
import { UserSearchListSkeleton } from './user-search-list-skeleton';
import { UserSearchListError } from './user-search-list-error';

interface UserSearchListProps {
  query: string;
}

function UserSearchList({ query }: UserSearchListProps) {
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchUsersSuspenseInfiniteQuery(query);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const users = data.pages.flatMap(page => page.data);

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <p className="text-sm">검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-2">
      {users.map(user => (
        <button
          key={user.id}
          onClick={() => router.push(`/community/user/${user.id}`)}
          className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted"
        >
          <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-card text-lg">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.nickname}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              '🐾'
            )}
          </div>
          <span className="text-sm font-medium text-foreground">{user.nickname}</span>
        </button>
      ))}
      <div ref={ref} className="flex justify-center py-2">
        {isFetchingNextPage && <p className="text-xs text-muted-foreground">불러오는 중...</p>}
      </div>
    </div>
  );
}

export default withErrorBoundary(
  withSuspense(UserSearchList, <UserSearchListSkeleton />),
  UserSearchListError
);
