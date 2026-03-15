import Image from 'next/image';
import type { RankingItem } from '@bragram/schemas/ranking';

const PET_EMOJI: Record<string, string> = {
  dog: '🐶',
  cat: '🐱',
};

interface RankingItemProps {
  item: RankingItem;
}

export function RankingListItem({ item }: RankingItemProps) {
  const petEmoji = PET_EMOJI[item.petType] ?? '🐾';

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3">
      <span className="w-6 text-center text-sm font-bold text-muted-foreground">{item.rank}</span>

      {/* 펫 이미지 */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[oklch(0.268_0.007_34.298)] text-xl">
        {item.petImageUrl ? (
          <Image src={item.petImageUrl} alt={item.petName} fill className="object-cover" />
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
                <Image
                  src={item.ownerProfileImage}
                  alt={item.ownerNickname}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">{item.ownerNickname}</p>
          </div>
        </div>
        <span className="rounded-full bg-[oklch(0.268_0.007_34.298)] px-2 py-0.5 text-[10px] text-muted-foreground">
          {item.petType === 'dog' ? '강아지' : '고양이'}
        </span>
      </div>

      <span className="text-sm font-bold text-[oklch(0.72_0.18_42)]">
        {item.score.toLocaleString()}P
      </span>
    </div>
  );
}
