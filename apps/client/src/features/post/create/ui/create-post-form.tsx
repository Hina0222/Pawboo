'use client';

import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useCreatePostForm } from '../hooks/useCreatePostForm';

export const CreatePostForm = () => {
  const { methods, onSubmit, isPending } = useCreatePostForm();
  const {
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
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

  return (
    <form onSubmit={onSubmit} className="mt-4 flex flex-1 flex-col gap-5 px-5">
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-foreground">
          사진
          <span className="ml-1 text-primary">*</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          {previewUrls.map((url, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-card">
              <img
                src={url}
                alt={`업로드 이미지 ${i + 1}`}
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
        {errors.images && (
          <p className="text-xs text-destructive">{errors.images.message as string}</p>
        )}
      </div>

      <div className="mt-auto pt-4 pb-10">
        <Button
          type="submit"
          disabled={isPending}
          className="h-13 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/80 disabled:opacity-40"
        >
          {isPending ? '등록 중...' : '완료'}
        </Button>
      </div>
    </form>
  );
};
