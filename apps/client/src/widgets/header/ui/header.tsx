import { ReactNode } from 'react';
import { Nav } from './nav';
import { BackButton } from './back-button';
import { NavLink } from './nav-link';
import { Title } from './title';

export function Header({ children }: { children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-10 grid grid-cols-[1fr_auto_1fr] items-center px-4 pt-2 pb-5">
      {children}
    </header>
  );
}

function Left({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-start">{children}</div>;
}

function Center({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-center">{children}</div>;
}

function Right({ children }: { children?: ReactNode }) {
  return <div className="flex items-center justify-end">{children}</div>;
}

Header.Left = Left;
Header.Center = Center;
Header.Right = Right;
Header.Nav = Nav;
Header.Back = BackButton;
Header.NavLink = NavLink;
Header.Title = Title;
