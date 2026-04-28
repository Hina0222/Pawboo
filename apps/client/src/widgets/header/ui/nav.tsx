'use client';

import { usePathname, Link } from '@/app/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import { motion } from 'framer-motion';
import CalendarIcon from '@/shared/assets/icons/CalendarIcon.svg';
import CalendarFillIcon from '@/shared/assets/icons/CalendarFillIcon.svg';
import HomeIcon from '@/shared/assets/icons/HomeIcon.svg';
import HomeFillIcon from '@/shared/assets/icons/HomeFillIcon.svg';
import MissionIcon from '@/shared/assets/icons/MissionIcon.svg';
import MissionFillIcon from '@/shared/assets/icons/MissionFillIcon.svg';

const navItems = [
  {
    href: '/',
    label: 'HOME',
    defaultIcon: HomeIcon,
    activeIcon: HomeFillIcon,
  },
  {
    href: '/mission',
    label: 'MISSION',
    defaultIcon: MissionIcon,
    activeIcon: MissionFillIcon,
  },
  {
    href: '/calendar',
    label: 'CALENDAR',
    defaultIcon: CalendarIcon,
    activeIcon: CalendarFillIcon,
  },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex rounded-full bg-[#333333CC] p-0.5 backdrop-blur-md">
      {navItems.map(({ href, defaultIcon, activeIcon }) => {
        const active = pathname === href;
        const Icon = active ? activeIcon : defaultIcon;

        return (
          <Link key={href} href={href} className={cn('relative flex-1 px-4 py-2')}>
            {active && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-full bg-[#E1E1E3] backdrop-blur-md"
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center">
              <Icon
                className={cn(
                  'transition-colors duration-200',
                  active ? 'text-[#4D4D4D]' : 'text-[#E1E1E3]'
                )}
              />
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
