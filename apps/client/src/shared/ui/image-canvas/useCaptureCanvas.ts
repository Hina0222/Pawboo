'use client';

import { type RefObject } from 'react';
import { toBlob } from 'html-to-image';

export const useCaptureCanvas = (ref: RefObject<HTMLDivElement | null>) => {
  const capture = async (): Promise<File | null> => {
    if (!ref.current) return null;

    try {
      const MAX_TARGET_WIDTH = 2048;
      const { width: currentWidth } = ref.current.getBoundingClientRect();
      const baseImg = ref.current.querySelector('img');
      const naturalWidth = baseImg?.naturalWidth ?? currentWidth;
      const targetWidth = Math.min(Math.max(naturalWidth, currentWidth), MAX_TARGET_WIDTH);

      const pixelRatio = targetWidth / currentWidth;
      const options = { pixelRatio, skipAutoScale: true };

      // 경험적 워밍업(toBlob 3회) 대신 기다리는 대상을 명시:
      // 웹폰트(캔버스에 사용자 입력 텍스트가 렌더됨) + 배경 이미지 디코드
      await Promise.all([document.fonts.ready, baseImg?.decode().catch(() => {})]);
      const blob = await toBlob(ref.current, options);

      if (!blob) return null;

      return new File([blob], 'canvas.png', { type: 'image/png' });
    } catch (error) {
      console.error('Capture failed:', error);
      return null;
    }
  };

  return { capture };
};
