'use client';

import Image from 'next/image';
import { useGetUserProfileSuspenseQuery } from '@/features/user/profile/api/useGetUserProfileQuery';

const PET_EMOJI: Record<string, string> = {
  dog: '🐶',
  cat: '🐱',
};

interface UserPetScrollProps {
  userId: number;
}

export function UserPetScroll({ userId }: UserPetScrollProps) {
  const { data: profile } = useGetUserProfileSuspenseQuery(userId);

  if (profile.pets.length === 0) return null;

  return (
    <section className="px-5 pb-6">
      <h2 className="mb-3 text-sm font-semibold text-foreground">반려동물</h2>
      <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-1">
        {profile.pets.map(pet => (
          <div key={pet.id} className="flex flex-shrink-0 flex-col items-center gap-1.5">
            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-[oklch(0.72_0.18_42/50%)] bg-card text-2xl">
              {pet.imageUrl ? (
                <Image src={pet.imageUrl} alt={pet.name} fill className="object-cover" />
              ) : (
                (PET_EMOJI[pet.type] ?? '🐾')
              )}
            </div>
            <span className="text-xs text-muted-foreground">{pet.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
