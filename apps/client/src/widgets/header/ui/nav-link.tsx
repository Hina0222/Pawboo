import { ComponentProps, ReactNode } from 'react';
import { Link } from '@/app/i18n/navigation';
import { cn } from '@/shared/lib/utils';

type NavLinkProps = ComponentProps<typeof Link> &
  (
    | { icon: ReactNode; image?: never }
    | { icon?: never; image: { src: string; alt: string; className?: string } }
  );

export function NavLink({ icon, image, className, ...props }: NavLinkProps) {
  return (
    <Link
      className={cn(
        'flex items-center justify-center rounded-full',
        icon && 'bg-[#333333CC] px-3.5 py-2.5',
        className
      )}
      {...props}
    >
      {icon}
      {image && (
        <div className="h-11 w-13 overflow-hidden rounded-full border border-[#E1E1E3]">
          <img
            src={image.src}
            alt={image.alt}
            className={cn('h-full w-full object-cover', image.className)}
          />
        </div>
      )}
    </Link>
  );
}
