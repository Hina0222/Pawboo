'use client';

import React, { useRef, useState } from 'react';
import { useCreatePetForm } from '@/features/pet/create/hooks/useCreatePetForm';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';
import CameraIcon from '@/shared/assets/icons/CameraIcon.svg';
import LogoIcon from '@/shared/assets/icons/LogoIcon.svg';

export function CreatePetForm() {
  const t = useTranslations('pet');
  const tc = useTranslations('common');
  const { methods, onSubmit, isPending } = useCreatePetForm();
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = methods;
  const name = watch('name');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setValue('image', file);
  };

  return (
    <form onSubmit={onSubmit} className="mt-5 mb-4 flex flex-1 flex-col justify-between px-4">
      <div className="space-y-10">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative mx-auto flex items-center justify-center rounded-full border-[2.5px] border-[#131313]"
        >
          <div className="overflow-hidden p-[3.5px]">
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
            {...register('name')}
            placeholder="닉네임을 입력해주세요 (최대 15자)"
            className={cn(
              'w-full rounded-[18px] border border-[#4D4D4D] bg-[#333333] px-6 py-4 text-[#E1E1E3] transition-colors outline-none placeholder:text-[#666666] focus:border-[#E1E1E3]',
              errors.name && 'border-destructive'
            )}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
      </div>

      <Button type="submit" disabled={isPending || !name?.trim()} size="primary" variant="primary">
        {isPending ? tc('saving') : '추가하기'}
      </Button>
    </form>
  );
}
