'use client';

import type { ReactNode } from 'react';
import XIcon from '@/shared/assets/icons/XIcon.svg';
import { Rnd } from 'react-rnd';
import { cn } from '@/shared/lib/cn';
import type { CanvasElement } from './canvas-element';

interface DraggableElementProps {
  element: CanvasElement;
  onChange: (id: string, update: Pick<CanvasElement, 'x' | 'y'>) => void;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  children: ReactNode;
}

export const DraggableElement = ({
  element,
  onChange,
  isSelected,
  onSelect,
  onDelete,
  children,
}: DraggableElementProps) => (
  <Rnd
    position={{ x: element.x, y: element.y }}
    size={{ width: element.width, height: element.height }}
    onDragStop={(_, d) => onChange(element.id, { x: d.x, y: d.y })}
    enableResizing={false}
    cancel=".rnd-no-drag"
    onMouseDown={e => {
      e.stopPropagation();
      onSelect?.();
    }}
    bounds="parent"
    style={{ overflow: 'visible', touchAction: 'none' }}
  >
    <div
      className={cn(
        'relative h-full w-full border-2',
        isSelected ? 'border-[#FADF78]' : 'border-transparent'
      )}
    >
      {isSelected && (
        <button
          type="button"
          className="rnd-no-drag absolute top-0 right-0 z-10 flex size-5 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#4A4A4F] text-[#E1E1E3]"
          onClick={e => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          <XIcon />
        </button>
      )}
      {children}
    </div>
  </Rnd>
);
