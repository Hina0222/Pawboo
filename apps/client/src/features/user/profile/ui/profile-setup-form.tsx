'use client';

import { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/shared/ui';
import { useProfileSetupForm } from '@/features/user/profile/hooks/useProfileSetupForm';
import { useTranslations } from 'next-intl';

export function ProfileSetupForm() {
  const t = useTranslations('profile');
  const tc = useTranslations('common');
  const { methods, canSubmit, isPending, onSubmit } = useProfileSetupForm();
  const { setValue, register, formState } = methods;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
    <>
      <header className="px-5 pt-12 pb-4">
        <div className="h-6" />
      </header>

      <form onSubmit={onSubmit} className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center gap-6 px-5">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold text-foreground">{t('setup')}</h2>
            <p className="text-sm text-muted-foreground">{t('setupDescription')}</p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative mt-4 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-primary/50 bg-card transition-colors hover:border-primary"
          >
            {previewUrl ? (
              <img src={previewUrl} alt={t('photo')} className="h-full w-full object-cover" />
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

          <p className="text-center text-xs text-muted-foreground">
            {t('photo')} <span className="text-xs">{t('optional')}</span>
          </p>

          <div className="w-full max-w-sm">
            <input
              {...register('nickname')}
              placeholder={t('nicknamePlaceholder')}
              maxLength={20}
              className="h-12 w-full rounded-xl border border-border bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            {formState.errors.nickname && (
              <p className="mt-1 text-xs text-destructive">{formState.errors.nickname.message}</p>
            )}
          </div>
        </div>
      </form>

      <div className="px-5 pt-4 pb-10">
        <Button
          type="button"
          className="h-13 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
          onClick={onSubmit}
          disabled={!canSubmit}
        >
          {isPending ? t('settingUp') : t('start')}
        </Button>
      </div>
    </>
  );
}
