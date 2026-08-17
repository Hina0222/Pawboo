'use client';

import { type ReactNode, type Ref } from 'react';
import { cn } from '@/shared/lib/cn';
import { DraggableElement } from './draggable-element';
import type { CanvasElement } from './canvas-element';

interface ImageCanvasProps {
  ref?: Ref<HTMLDivElement>;
  imageUrl: string;
  elements: CanvasElement[];
  onElementChange: (id: string, update: Pick<CanvasElement, 'x' | 'y'>) => void;
  renderElement: (element: CanvasElement) => ReactNode;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onElementDelete?: (id: string) => void;
  className?: string;
}

export const ImageCanvas = ({
  ref,
  imageUrl,
  elements,
  onElementChange,
  renderElement,
  selectedId,
  onSelect,
  onElementDelete,
  className,
}: ImageCanvasProps) => (
  <div
    ref={ref}
    className={cn('relative aspect-square overflow-hidden rounded-[30px]', className)}
    onMouseDown={() => onSelect?.(null)}
  >
    <img src={imageUrl} alt="업로드 이미지" className="h-full w-full object-cover" />
    {elements.map(element => (
      <DraggableElement
        key={element.id}
        element={element}
        onChange={onElementChange}
        isSelected={selectedId === element.id}
        onSelect={() => onSelect?.(element.id)}
        onDelete={() => onElementDelete?.(element.id)}
      >
        {renderElement(element)}
      </DraggableElement>
    ))}
  </div>
);
