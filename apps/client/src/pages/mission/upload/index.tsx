'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, Camera, ImagePlus } from 'lucide-react';
import { Button } from '@/shared/ui';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function MissionUploadPage() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!photo) return;
    setIsSubmitting(true);
    // TODO: API 연동 — POST /missions/:id/verify
    setTimeout(() => {
      setIsSubmitting(false);
      router.back();
    }, 1000);
  };

  return (
    <>
      {/* 헤더 */}
      <header className="flex items-center gap-3 px-5 pt-12 pb-4">
        <button
          onClick={() => router.back()}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-base font-semibold text-foreground">미션 인증</h1>
      </header>

      {/* 미션 정보 */}
      <div className="mx-5 mb-5 flex items-center gap-3 rounded-2xl border border-[oklch(0.72_0.18_42/30%)] bg-[oklch(0.72_0.18_42/12%)] px-4 py-3">
        <span className="text-2xl">🚶</span>
        <div>
          <p className="text-sm font-semibold text-[oklch(0.72_0.18_42)]">30분 산책 인증</p>
          <p className="text-xs text-muted-foreground">완료 시 +150P 획득</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 px-5">
        {/* 사진 업로드 */}
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">
            인증 사진 <span className="text-[oklch(0.72_0.18_42)]">*</span>
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[oklch(0.72_0.18_42/50%)] bg-card transition-colors hover:border-[oklch(0.72_0.18_42)]"
          >
            {photo ? (
              <Image src={photo} alt="인증 사진" fill className="object-cover" />
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
          {photo && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-border py-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Camera size={14} />
              사진 변경
            </button>
          )}
        </div>

        {/* 한마디 */}
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">
            한마디 <span className="text-xs text-muted-foreground">(선택)</span>
          </p>
          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="오늘의 미션을 짧게 기록해보세요..."
            maxLength={100}
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[oklch(0.72_0.18_42)] focus:outline-none"
          />
          <p className="mt-1 text-right text-xs text-muted-foreground">{caption.length}/100</p>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="px-5 pt-4 pb-10">
        <Button
          onClick={handleSubmit}
          disabled={!photo || isSubmitting}
          className="h-13 w-full rounded-2xl bg-[oklch(0.72_0.18_42)] text-base font-semibold text-[oklch(0.985_0.001_106.423)] hover:bg-[oklch(0.65_0.18_42)] disabled:opacity-40"
        >
          {isSubmitting ? '제출 중...' : '인증 완료'}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoChange}
      />
    </>
  );
}
