'use client';

import type { FallbackProps } from 'react-error-boundary';
import { Header } from '@/widgets/header';
import LogoIcon from '@/shared/assets/icons/LogoIcon.svg';

export function HomePetAvatarError(_props: FallbackProps) {
  return <Header.NavLink href="/my" icon={<LogoIcon />} />;
}
