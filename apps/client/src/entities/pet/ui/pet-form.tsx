'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/cn';
import { useTranslations } from 'next-intl';
import CameraIcon from '@/shared/assets/icons/CameraIcon.svg';
import LogoIcon from '@/shared/assets/icons/LogoIcon.svg';

interface PetFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  nameInputProps: UseFormRegisterReturn;
  nameError?: string;
  onImageSelect: (file: File) => void;
  initialPreviewUrl?: string | null;
  placeholder: string;
  submitLabel: string;
  submitDisabled: boolean;
  isPending: boolean;
  avatarClassName: string;
  avatarInnerClassName?: string;
}

export function PetForm({
  onSubmit,
  nameInputProps,
  nameError,
  onImageSelect,
  initialPreviewUrl,
  placeholder,
  submitLabel,
  submitDisabled,
  isPending,
  avatarClassName,
  avatarInnerClassName,
}: PetFormProps) {
  const t = useTranslations('pet');
  const tc = useTranslations('common');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPreviewUrl ?? null);

  useEffect(
    () => () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    onImageSelect(file);
  };

  return (
    <form onSubmit={onSubmit} className="mt-5 mb-4 flex flex-1 flex-col justify-between px-4">
      <div className="space-y-10">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'relative mx-auto flex items-center justify-center rounded-full border-[2.5px]',
            avatarClassName
          )}
        >
          <div className={cn('overflow-hidden', avatarInnerClassName)}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={t('petPhoto')}
                className="h-16.5 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16.5 w-20 items-center justify-center rounded-full border border-[#E1E1E3] bg-[#FADF78]">
                <LogoIcon className="h-10 w-10 text-[#C59D07]" />
              </div>
            )}
          </div>
          <div
            className="absolute right-[-3px] bottom-[-3px] rounded-full border-3 border-[#131313] bg-white px-1 py-0.25"
            onClick={e => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <CameraIcon className="text-[#131313]" />
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col gap-2.5">
          <label className="font-semibold text-[#666666]">닉네임</label>
          <input
            {...nameInputProps}
            placeholder={placeholder}
            className={cn(
              'w-full rounded-[18px] border border-[#4D4D4D] bg-[#333333] px-6 py-4 text-[#E1E1E3] transition-colors outline-none placeholder:text-[#666666] focus:border-[#E1E1E3]',
              nameError && 'border-destructive'
            )}
          />
          {nameError && <p className="text-destructive text-xs">{nameError}</p>}
        </div>
      </div>

      <Button type="submit" disabled={submitDisabled} size="primary" variant="primary">
        {isPending ? tc('saving') : submitLabel}
      </Button>
    </form>
  );
}
