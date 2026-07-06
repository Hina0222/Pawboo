'use client';

import React, { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useSubmitMissionForm } from '@/features/mission/submit';
import { ImageCanvas, useCanvasElements, useCaptureCanvas } from '@/features/image-canvas';
import CameraIcon from '@/shared/assets/icons/CameraIcon.svg';
import LogoIcon from '@/shared/assets/icons/LogoIcon.svg';
import PlusIcon from '@/shared/assets/icons/PlusIcon.svg';

interface SubmitMissionFormProps {
  missionId: number;
}

export const SubmitMissionForm = ({ missionId }: SubmitMissionFormProps) => {
  const { methods, onSubmit, isPending } = useSubmitMissionForm();
  const {
    setValue,
    formState: { errors },
  } = methods;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    elements,
    selectedId,
    setSelectedId,
    handleElementChange,
    handleTextChange,
    addElement,
    deleteElement,
    isMaxElements,
  } = useCanvasElements();

  const { capture } = useCaptureCanvas(canvasRef);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setValue('images', [file], { shouldValidate: true });
    e.target.value = '';
  };

  const handleFormSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    flushSync(() => setSelectedId(null));
    const file = await capture();
    if (!file) return;
    setValue('images', [file]);
    await onSubmit(missionId)();
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      onMouseDown={() => setSelectedId(null)}
      className="flex flex-1 flex-col justify-between px-4"
    >
      {previewUrl ? (
        <div className="flex flex-col items-center gap-4">
          <h3 className="inline-flex items-center gap-1 rounded-full bg-[#333333] px-4 py-3 text-sm font-semibold text-[##E1E1E3]">
            발자국으로 자유롭게 꾸며보세요
            <LogoIcon className="h-4 w-4 text-[#FADF78]" />
          </h3>
          <ImageCanvas
            ref={canvasRef}
            imageUrl={previewUrl}
            elements={elements}
            onElementChange={handleElementChange}
            renderElement={el => (
              <div className="relative h-full w-full">
                <LogoIcon className="h-full w-full" />
                {selectedId === el.id ? (
                  <input
                    ref={node => node?.focus()}
                    type="text"
                    value={el.text ?? ''}
                    onChange={e => handleTextChange(el.id, e.target.value)}
                    className="absolute bottom-1.5 left-1/2 w-full -translate-x-1/2 text-center text-base font-bold text-[#131313] caret-[#131313] focus:outline-none"
                  />
                ) : (
                  el.text && (
                    <span className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 items-center justify-center text-base font-bold text-[#131313]">
                      {el.text}
                    </span>
                  )
                )}
              </div>
            )}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onElementDelete={deleteElement}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (!canvasRef.current) return;
                const { width, height } = canvasRef.current.getBoundingClientRect();
                addElement(Math.round(width / 2 - 30), Math.round(height / 2 - 30));
              }}
              disabled={isMaxElements}
              className="rounded-full bg-[#333333] px-7 py-5.25 disabled:opacity-40"
            >
              <PlusIcon />
            </button>
            <span className="font-semibold text-[#666666]">발자국 추가</span>
          </div>
        </div>
      ) : (
        <div className="mt-14 flex aspect-square flex-col items-center justify-center space-y-6 rounded-[30px] border-3 border-dashed border-[#333333]">
          <h3 className="font-semibold text-[#E1E1E3]">편집할 사진을 선택해주세요</h3>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mx-auto flex items-center justify-center gap-2 rounded-full bg-[#E1E1E3] p-4 text-[#131313]"
          >
            <span className="font-medium">사진 업로드</span>
            <CameraIcon />
          </button>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {errors.images && <p className="text-destructive text-xs">{errors.images.message}</p>}

      <button
        type="submit"
        disabled={isPending || !previewUrl}
        className="mb-4 w-full rounded-[18px] bg-[#FADF78] py-4 font-semibold text-[#4D4D4D] disabled:bg-[#4D4D4D] disabled:text-[#808080]"
      >
        업로드
      </button>
    </form>
  );
};
