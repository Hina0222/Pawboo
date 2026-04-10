'use client';

import { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { CreatePetFormValues } from '@/features/pet/create/model/schema';
import { useTranslations } from 'next-intl';

export function StepPhoto() {
  const t = useTranslations('pet');
  const tc = useTranslations('common');
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
        <h2 className="mb-2 text-2xl font-bold text-foreground">{t('profilePhoto')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('registerPhoto')} <span className="text-xs">{t('optional')}</span>
        </p>
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="relative mt-4 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-primary/50 bg-card transition-colors hover:border-primary"
      >
        {previewUrl ? (
          <img src={previewUrl} alt={t('petPhoto')} className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Camera size={28} />
            <span className="text-xs">{tc('addPhoto')}</span>
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
        {t('tapToSelect')}
        <br />
        {t('takePhoto')}
      </p>
    </div>
  );
}
