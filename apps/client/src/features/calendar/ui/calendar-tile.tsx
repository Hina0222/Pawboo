'use client';

import type { PostItem } from '@pawboo/schemas/post';
import LogoIcon from '@/shared/assets/icons/LogoIcon.svg';

interface CalendarTileProps {
  date: Date;
  post?: PostItem;
}

export function CalendarTile({ date, post }: CalendarTileProps) {
  const day = date.getDate();

  return (
    <div className="relative mx-auto aspect-square">
      {post ? (
        <>
          <img src={post.imageUrls[0]} alt="" className="h-full w-full rounded-full object-cover" />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-[#E1E1E3]">
            {day}
          </span>
          {post.type === 'mission' && (
            <LogoIcon className="absolute bottom-0.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 text-[#FADF78]" />
          )}
        </>
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-[#E1E1E3]">
          {day}
        </span>
      )}
    </div>
  );
}
