'use client';

import { useRouter } from '@/app/i18n/navigation';
import LeftArrowIcon from '@/shared/assets/icons/LeftArrowIcon.svg';

export function BackButton() {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className="rounded-full bg-[#333333CC] px-3.5 py-2.5">
      <LeftArrowIcon />
    </button>
  );
}
