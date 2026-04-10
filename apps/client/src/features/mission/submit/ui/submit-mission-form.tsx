'use client';

import { useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useSubmitMissionForm } from '@/features/mission/submit/hooks/useSubmitMissionForm';
import { useTranslations } from 'next-intl';

interface SubmitMissionFormProps {
  missionId: number;
}

export const SubmitMissionForm = ({ missionId }: SubmitMissionFormProps) => {
  const t = useTranslations('submit');
  const { methods, onSubmit, isPending } = useSubmitMissionForm();
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');

  const hashtags = watch('hashtags') ?? [];
  const images = watch('images') ?? [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const remaining = 5 - images.length;
    const added = files.slice(0, remaining);
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    const newFiles = [...images, ...added];
    setPreviewUrls(newFiles.map(f => URL.createObjectURL(f)));
    setValue('images', newFiles, { shouldValidate: true });
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    const newFiles = images.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newUrls);
    setValue('images', newFiles, { shouldValidate: true });
  };

  const addHashtag = (value: string) => {
    const tag = value.trim().replace(/^#/, '');
    if (!tag || hashtags.length >= 5 || hashtags.includes(tag)) return;
    setValue('hashtags', [...hashtags, tag]);
    setHashtagInput('');
  };

  const removeHashtag = (tag: string) => {
    setValue(
      'hashtags',
      hashtags.filter(h => h !== tag)
    );
  };

  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      addHashtag(hashtagInput);
    } else if (e.key === 'Backspace' && !hashtagInput && hashtags.length > 0) {
      removeHashtag(hashtags[hashtags.length - 1]);
    }
  };

  return (
    <form onSubmit={onSubmit(missionId)} className="mt-4 flex flex-1 flex-col gap-5 px-5">
      <FormField label={t('photo')} required error={errors.images?.message as string | undefined}>
        <div className="grid grid-cols-3 gap-2">
          {previewUrls.map((url, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-card">
              <img
                src={url}
                alt={t('photoAlt', { index: i + 1 })}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-primary/50 bg-card transition-colors hover:border-primary"
            >
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <ImagePlus size={24} />
                <span className="text-xs">{images.length}/5</span>
              </div>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </FormField>

      <FormField label={t('comment')} error={errors.comment?.message}>
        <textarea
          {...register('comment')}
          placeholder={t('commentPlaceholder')}
          maxLength={150}
          rows={3}
          className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </FormField>

      <FormField label={t('hashtag')}>
        <Controller
          control={control}
          name="hashtags"
          render={() => (
            <div className="flex min-h-11 flex-wrap gap-2 rounded-xl border border-border bg-card px-3 py-2 focus-within:border-primary">
              {hashtags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-primary/12 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  #{tag}
                  <button type="button" onClick={() => removeHashtag(tag)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              {hashtags.length < 5 && (
                <input
                  value={hashtagInput}
                  onChange={e => setHashtagInput(e.target.value)}
                  onKeyDown={handleHashtagKeyDown}
                  onBlur={() => addHashtag(hashtagInput)}
                  placeholder={hashtags.length === 0 ? t('hashtagPlaceholder') : ''}
                  className="min-w-[140px] flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              )}
            </div>
          )}
        />
        <p className="mt-1 text-right text-xs text-muted-foreground">{hashtags.length}/5</p>
      </FormField>

      <div className="mt-auto pt-4 pb-10">
        <Button
          type="submit"
          disabled={isPending}
          className="h-13 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/80 disabled:opacity-40"
        >
          {isPending ? t('submitting') : t('complete')}
        </Button>
      </div>
    </form>
  );
};

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </p>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
