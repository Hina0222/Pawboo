'use client';

export function PetSearchError() {
  return (
    <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
      <p>검색 결과를 불러오지 못했습니다.</p>
    </div>
  );
}
