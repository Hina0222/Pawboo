'use client';

import { useState } from 'react';
import type { CanvasElement } from './canvas-element';

const MAX_ELEMENTS = 5;
const segmenter = new Intl.Segmenter();

export const useCanvasElements = () => {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleElementChange = (id: string, update: Pick<CanvasElement, 'x' | 'y'>) => {
    setElements(prev => prev.map(el => (el.id === id ? { ...el, ...update } : el)));
  };

  const handleTextChange = (id: string, value: string) => {
    const last = [...segmenter.segment(value)].at(-1)?.segment ?? '';
    setElements(prev => prev.map(el => (el.id === id ? { ...el, text: last } : el)));
  };

  const addElement = (x: number, y: number) => {
    if (elements.length >= MAX_ELEMENTS) return;
    setElements(prev => [...prev, { id: crypto.randomUUID(), x, y, width: 60, height: 60 }]);
  };

  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    setSelectedId(null);
  };

  return {
    elements,
    selectedId,
    setSelectedId,
    handleElementChange,
    handleTextChange,
    addElement,
    deleteElement,
    isMaxElements: elements.length >= MAX_ELEMENTS,
  };
};
