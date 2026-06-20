import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2 typography-title-m whitespace-nowrap transition-all outline-none',
    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'disabled:pointer-events-none',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-yellow-300 text-black',
          'active:bg-yellow-200 active:text-gray-800',
          'hover:bg-yellow-200 hover:text-gray-800',
          'disabled:bg-gray-600 disabled:text-gray-400',
        ],
        secondary: [
          'bg-gray-500 text-gray-300',
          'active:bg-gray-400 active:text-gray-300',
          'hover:bg-gray-400 hover:text-gray-300',
          'disabled:bg-gray-600 disabled:text-gray-400',
        ],
        danger: [
          'bg-red-500 text-white',
          'active:bg-red-300 active:text-white',
          'hover:bg-red-300 hover:text-white',
          'disabled:bg-gray-600 disabled:text-gray-400',
        ],
        text: 'text-gray-200 underline',
        header: ['bg-gray-800/80 backdrop-blur-md', 'active:bg-gray-600', 'hover:bg-gray-600'],
        'round-dark': [
          'bg-gray-800/80 text-gray-200 border border-2 border-gray-600 backdrop-blur-md',
          'active:bg-gray-600 active:border-gray-400',
          'hover:bg-gray-600 hover:border-gray-400',
          'disabled:bg-gray-800 disabled:border-gray-600 disabled:text-gray-600',
        ],
        'round-light': [
          'bg-gray-200 text-black',
          'active:bg-gray-300',
          'hover:bg-gray-300',
          'disabled:bg-gray-600 disabled:text-gray-400',
        ],
      },
      size: {
        sm: 'h-11 rounded-xl px-3',
        md: 'h-12 rounded-[10px] px-4',
        lg: 'h-14 rounded-2xl px-5',
        icon: "w-14 h-11 rounded-full [&_svg:not([class*='size-'])]:size-6",
        round: 'h-14 rounded-full pl-6 pr-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

function Button({
  className,
  variant = 'primary',
  size = 'md',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
