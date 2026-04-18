'use client';

import { useEffect } from 'react';
import { useRouter } from '@/app/i18n/navigation';
import { useInView } from 'react-intersection-observer';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { useSearchUsersSuspenseInfiniteQuery } from '../api/useSearchUsersInfiniteQuery';
import { UserSearchListSkeleton } from './user-search-list-skeleton';
import { UserSearchListError } from './user-search-list-error';
import { useTranslations } from 'next-intl';
import type { SearchType, UserSearchResponse, PetSearchResponse } from '@pawboo/schemas/user';

interface UserSearchListProps {
  query: string;
  type: SearchType;
}

function UserSearchList({ query, type }: UserSearchListProps) {
  const t = useTranslations('community');
  const tc = useTranslations('common');
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchUsersSuspenseInfiniteQuery(query, type);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const emptyResult = (
    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
      <p className="text-sm">{t('noResults')}</p>
    </div>
  );

  const loadMore = (
    <div ref={ref} className="flex justify-center py-2">
      {isFetchingNextPage && <p className="text-xs text-muted-foreground">{tc('loading')}</p>}
    </div>
  );

  if (type === 'user') {
    const users = (data.pages as UserSearchResponse[]).flatMap(page => page.data);
    if (users.length === 0) return emptyResult;
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
        {loadMore}
      </div>
    );
  }

  const pets = (data.pages as PetSearchResponse[]).flatMap(page => page.data);
  if (pets.length === 0) return emptyResult;
  return (
    <div className="flex flex-col py-2">
      {pets.map(pet => (
        <button
          key={pet.id}
          onClick={() => router.push(`/community/user/${pet.ownerId}/${pet.id}`)}
          className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted"
        >
          <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-card text-lg">
            {pet.imageUrl ? (
              <img
                src={pet.imageUrl}
                alt={pet.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : pet.type === 'cat' ? (
              '🐱'
            ) : (
              '🐶'
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-foreground">{pet.name}</span>
            <span className="text-xs text-muted-foreground">{pet.ownerNickname}</span>
          </div>
        </button>
      ))}
      {loadMore}
    </div>
  );
}

export default withErrorBoundary(
  withSuspense(UserSearchList, <UserSearchListSkeleton />),
  UserSearchListError
);
