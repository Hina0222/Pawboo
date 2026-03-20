'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Target, Trophy, Users, User } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const tabs = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/mission', icon: Target, label: '미션' },
  { href: '/ranking', icon: Trophy, label: '랭킹' },
  { href: '/community', icon: Users, label: '커뮤니티' },
  { href: '/my', icon: User, label: '마이' },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 flex h-20 w-full max-w-[390px] -translate-x-1/2 items-center justify-around rounded-t-3xl border-t border-primary/10 bg-card/95 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] backdrop-blur-md">
      {tabs.map(({ href, icon: Icon, label }) => {
        const active = pathname === href;
        return (
          <button
            key={href}
            onClick={() => router.push(href)}
            className="flex flex-1 flex-col items-center gap-1 py-2 transition-colors duration-200"
          >
            <Icon size={22} className={cn(active ? 'text-primary' : 'text-muted-foreground')} />
            <span
              className={cn(
                'text-[10px] font-medium',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
