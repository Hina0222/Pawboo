'use client';

import type { RankingItem } from '@bragram/schemas/ranking';
import { useTranslations } from 'next-intl';

const PET_EMOJI: Record<string, string> = {
  dog: '🐶',
  cat: '🐱',
};

interface RankingItemProps {
  item: RankingItem;
}

export function RankingListItem({ item }: RankingItemProps) {
  const tc = useTranslations('common');
  const petEmoji = PET_EMOJI[item.petType] ?? '🐾';

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3">
      <span className="w-6 text-center text-sm font-bold text-muted-foreground">{item.rank}</span>

      {/* 펫 이미지 */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-xl">
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

      {/* 펫 정보 */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{item.petName}</p>
          <div className="flex items-center gap-1">
            {item.ownerProfileImage && (
              <div className="relative h-3.5 w-3.5 overflow-hidden rounded-full">
                <img
                  src={item.ownerProfileImage}
                  alt={item.ownerNickname}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">{item.ownerNickname}</p>
          </div>
        </div>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
          {item.petType === 'dog' ? tc('dog') : tc('cat')}
        </span>
      </div>

      <span className="text-sm font-bold text-primary">{item.score.toLocaleString()}P</span>
    </div>
  );
}
