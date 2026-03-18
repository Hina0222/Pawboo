'use client';

import { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { CreatePetFormValues } from '@/features/pet/create/model/schema';

export function StepPhoto() {
  const { setValue, getValues } = useFormContext<CreatePetFormValues>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(() => {
    const file = getValues('image');
    return file ? URL.createObjectURL(file) : null;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);

    setPreviewUrl(url);
    setValue('image', file);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-foreground">프로필 사진</h2>
        <p className="text-sm text-muted-foreground">
          반려동물 사진을 등록해주세요 <span className="text-xs">(선택)</span>
        </p>
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="relative mt-4 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-brand/50 bg-card transition-colors hover:border-brand"
      >
        {previewUrl ? (
          <img src={previewUrl} alt="펫 사진" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Camera size={28} />
            <span className="text-xs">사진 추가</span>
          </div>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <p className="mt-2 text-center text-xs text-muted-foreground">
        탭하여 갤러리에서 사진을 선택하거나
        <br />
        카메라로 바로 촬영하세요
      </p>
    </div>
  );
}
