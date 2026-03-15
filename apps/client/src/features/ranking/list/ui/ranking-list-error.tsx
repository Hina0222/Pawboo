'use client';

export function RankingListError() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <p className="text-sm">랭킹을 불러오지 못했습니다.</p>
    </div>
  );
}
