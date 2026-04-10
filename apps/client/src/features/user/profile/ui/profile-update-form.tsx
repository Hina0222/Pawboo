'use client';

import { useRef, useState } from 'react';
import { Camera, ChevronLeft } from 'lucide-react';
import { useRouter } from '@/app/i18n/navigation';
import { Button } from '@/shared/ui';
import { useProfileUpdateForm } from '@/features/user/profile/hooks/useProfileUpdateForm';
import { useTranslations } from 'next-intl';

export function ProfileUpdateForm() {
  const t = useTranslations('profile');
  const tc = useTranslations('common');
  const router = useRouter();
  const { methods, canSubmit, isPending, onSubmit, currentProfileImage } = useProfileUpdateForm();
  const { setValue, register, formState } = methods;
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentProfileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);

    setPreviewUrl(url);
    setValue('image', file);
  };

  return (
    <>
      <header className="flex items-center gap-3 px-5 pt-12 pb-4">
        <button
          onClick={() => router.back()}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-base font-semibold text-foreground">{t('edit')}</h1>
      </header>

      <form onSubmit={onSubmit} className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center gap-6 px-5 pt-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-primary/50 bg-card transition-colors hover:border-primary"
          >
            {previewUrl ? (
              <img src={previewUrl} alt={t('photo')} className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                <Camera size={24} />
                <span className="text-xs">{t('changePhoto')}</span>
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

          <div className="w-full max-w-sm">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t('nickname')}
            </label>
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
          {isPending ? tc('saving') : tc('save')}
        </Button>
      </div>
    </>
  );
}
