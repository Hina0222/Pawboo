'use client';

import { usePathname, Link } from '@/app/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', label: 'HOME' },
  { href: '/mission', label: 'MISSION' },
  { href: '/calendar', label: 'CALENDAR' },
] as const;

export function Nav() {
  const pathname = usePathname();
  const activeIndex = navItems.findIndex(item => item.href === pathname);

  return (
    <nav className="flex gap-x-2.5 rounded-full bg-[#33333380] p-1">
      {navItems.map(({ href, label }, index) => {
        const active = pathname === href;
        const isFirst = index === 0;
        const isLast = index === navItems.length - 1;
        const lastIndex = navItems.length - 1;

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'relative flex-1 py-2.5 text-center text-xs font-semibold text-[#E1E1E3]',
              active
                ? 'px-4'
                : [
                    isFirst && (activeIndex === lastIndex ? 'pl-4' : 'pl-2'),
                    isLast && (activeIndex === 0 ? 'pr-4' : 'pr-2'),
                  ]
            )}
          >
            {active && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-full bg-[#4D4D4D]"
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                }}
              />
            )}

            <span className={cn('relative z-10', !active && 'opacity-30')}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
