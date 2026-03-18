'use client';

import { useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Camera, ImagePlus, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useSubmitMissionForm } from '@/features/mission/submit/hooks/useSubmitMissionForm';

interface SubmitMissionFormProps {
  missionId: number;
}

export const SubmitMissionForm = ({ missionId }: SubmitMissionFormProps) => {
  const { methods, onSubmit, isPending } = useSubmitMissionForm();
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hashtagInput, setHashtagInput] = useState('');

  const hashtags = watch('hashtags') ?? [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setValue('image', file, { shouldValidate: true });
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
    <form onSubmit={onSubmit(missionId)} className="flex flex-1 flex-col gap-5 px-5">
      <FormField label="인증 사진" required error={errors.image?.message as string | undefined}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[oklch(0.72_0.18_42/50%)] bg-card transition-colors hover:border-[oklch(0.72_0.18_42)]"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="인증 사진"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <ImagePlus size={40} />
              <div className="text-center">
                <p className="text-sm font-medium">사진을 추가해주세요</p>
                <p className="mt-0.5 text-xs">탭하여 갤러리에서 선택</p>
              </div>
            </div>
          )}
        </button>
        {previewUrl && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-border py-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Camera size={14} />
            사진 변경
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </FormField>

      <FormField label="한마디" error={errors.comment?.message}>
        <textarea
          {...register('comment')}
          placeholder="오늘의 미션을 짧게 기록해보세요..."
          maxLength={150}
          rows={3}
          className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[oklch(0.72_0.18_42)] focus:outline-none"
        />
      </FormField>

      <FormField label="해시태그">
        <Controller
          control={control}
          name="hashtags"
          render={() => (
            <div className="flex min-h-11 flex-wrap gap-2 rounded-xl border border-border bg-card px-3 py-2 focus-within:border-[oklch(0.72_0.18_42)]">
              {hashtags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-[oklch(0.72_0.18_42/12%)] px-2.5 py-1 text-xs font-medium text-[oklch(0.72_0.18_42)]"
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
                  placeholder={hashtags.length === 0 ? '#해시태그 입력 후 Space' : ''}
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
          className="h-13 w-full rounded-2xl bg-[oklch(0.72_0.18_42)] text-base font-semibold text-[oklch(0.985_0.001_106.423)] hover:bg-[oklch(0.65_0.18_42)] disabled:opacity-40"
        >
          {isPending ? '제출 중...' : '인증 완료'}
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
        {required && <span className="ml-1 text-[oklch(0.72_0.18_42)]">*</span>}
      </p>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
