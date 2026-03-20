'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BackHeaderProps {
  title?: string;
}

export function BackHeader({ title }: BackHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-primary/10 bg-background/80 px-5 shadow-sm backdrop-blur-md">
      <button
        onClick={() => router.back()}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft size={24} />
      </button>
      {title && <h1 className="text-xl font-semibold text-foreground">{title}</h1>}
    </header>
  );
}
