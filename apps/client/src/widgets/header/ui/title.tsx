import { ReactNode } from 'react';

export function Title({ children }: { children: ReactNode }) {
  return <h1 className="text-base font-semibold text-[#E1E1E3]">{children}</h1>;
}
