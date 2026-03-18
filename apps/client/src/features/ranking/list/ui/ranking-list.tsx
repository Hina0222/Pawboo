'use client';

import { useEffect } from 'react';
import { Medal, Trophy } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { cn } from '@/shared/lib/utils';
import type { RankingItem, RankingQuery } from '@bragram/schemas/ranking';
import { useGetRankingsSuspenseInfiniteQuery } from '../api/useGetRankingsInfiniteQuery';
import { RankingListItem } from './ranking-item';
import { RankingListSkeleton } from './ranking-list-skeleton';
import { RankingListError } from './ranking-list-error';

const PET_EMOJI: Record<string, string> = {
  dog: '🐶',
  cat: '🐱',
};

const MEDAL_COLOR = [
  'text-[oklch(0.85_0.18_85)]',
  'text-[oklch(0.78_0.01_250)]',
  'text-[oklch(0.68_0.12_50)]',
];

const PODIUM_GRAD = [
  'from-[oklch(0.45_0.14_80)] to-[oklch(0.35_0.10_85)]',
  'from-[oklch(0.38_0.02_250)] to-[oklch(0.30_0.01_250)]',
  'from-[oklch(0.40_0.10_50)] to-[oklch(0.32_0.08_50)]',
];

interface PodiumItemProps {
  item: RankingItem;
  grad: string;
  height: string;
  medal: string;
  isFirst?: boolean;
}

function PodiumItem({ item, grad, height, medal, isFirst = false }: PodiumItemProps) {
  const petEmoji = PET_EMOJI[item.petType] ?? '🐾';

  return (
    <div className="flex flex-1 flex-col items-center gap-1">
      {isFirst && <Trophy size={14} className="text-[oklch(0.85_0.18_85)]" />}
      <div
        className={cn(
          'relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 bg-[oklch(0.268_0.007_34.298)] text-2xl',
          isFirst ? 'border-[oklch(0.85_0.18_85)]' : 'border-border'
        )}
      >
        {item.petImageUrl ? (
          <img
            src={item.petImageUrl}
            alt={item.petName}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          petEmoji
        )}
      </div>
      <p className="w-full truncate text-center text-[11px] font-medium text-foreground">
        {item.petName}
      </p>
      <div
        className={cn(
          'flex w-full flex-col items-center justify-center gap-1 rounded-t-xl bg-gradient-to-b',
          height,
          grad
        )}
      >
        <Medal size={13} className={medal} />
        <span className="text-xs font-bold text-white">{item.rank}위</span>
        <span className="text-[10px] text-white/70">
          {item.score >= 1000 ? `${(item.score / 1000).toFixed(1)}K` : item.score}
        </span>
      </div>
    </div>
  );
}

interface RankingListProps {
  type?: RankingQuery['type'];
}

function RankingList({ type = 'all' }: RankingListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetRankingsSuspenseInfiniteQuery(type);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const allItems = data.pages.flatMap(page => page.data);
  const top3 = allItems.slice(0, 3);
  const rest = allItems.slice(3);

  if (allItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-sm">아직 랭킹 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {/* TOP 3 포디움 */}
      {top3.length >= 3 && (
        <section className="mb-6 px-5">
          <div className="flex items-end justify-center gap-3">
            {top3[1] && (
              <PodiumItem
                item={top3[1]}
                grad={PODIUM_GRAD[1]}
                height="h-28"
                medal={MEDAL_COLOR[1]}
              />
            )}
            {top3[0] && (
              <PodiumItem
                item={top3[0]}
                grad={PODIUM_GRAD[0]}
                height="h-36"
                medal={MEDAL_COLOR[0]}
                isFirst
              />
            )}
            {top3[2] && (
              <PodiumItem
                item={top3[2]}
                grad={PODIUM_GRAD[2]}
                height="h-24"
                medal={MEDAL_COLOR[2]}
              />
            )}
          </div>
        </section>
      )}

      {/* 4위 이하 */}
      {rest.length > 0 && (
        <section className="flex flex-col gap-2 px-5">
          {rest.map(item => (
            <RankingListItem key={item.petId} item={item} />
          ))}
        </section>
      )}

      {/* 무한 스크롤 트리거 */}
      <div ref={ref} className="flex justify-center py-4">
        {isFetchingNextPage && <p className="text-xs text-muted-foreground">불러오는 중...</p>}
      </div>
    </div>
  );
}

export default withErrorBoundary(
  withSuspense(RankingList, <RankingListSkeleton />),
  RankingListError
);
