'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, Camera } from 'lucide-react';
import { Button } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Gender = 'male' | 'female' | null;

export default function MyPetPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState('코코');
  const [breed, setBreed] = useState('말티즈');
  const [gender, setGender] = useState<Gender>('male');
  const [birthday, setBirthday] = useState('2022-03-15');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
  };

  const handleSave = () => {
    // TODO: API 연동 — PATCH /pets/:id
    router.back();
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
        <h1 className="text-base font-semibold text-foreground">펫 프로필 편집</h1>
      </header>

      <div className="flex flex-1 flex-col gap-6 px-5">
        {/* 프로필 사진 */}
        <div className="flex flex-col items-center gap-3 py-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[oklch(0.72_0.18_42/50%)] bg-card transition-colors hover:border-[oklch(0.72_0.18_42)]"
          >
            {photo ? (
              <Image src={photo} alt="펫 사진" fill className="object-cover" />
            ) : (
              <span className="text-4xl">🐶</span>
            )}
            <div className="absolute right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-full bg-[oklch(0.72_0.18_42)]">
              <Camera size={13} className="text-white" />
            </div>
          </button>
          <p className="text-xs text-muted-foreground">탭하여 사진 변경</p>
        </div>

        {/* 폼 */}
        <div className="flex flex-col gap-4">
          <FormField label="이름" required>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="반려동물 이름"
              className="h-12 w-full rounded-xl border border-border bg-card px-4 text-foreground transition-colors placeholder:text-muted-foreground focus:border-[oklch(0.72_0.18_42)] focus:outline-none"
            />
          </FormField>

          <FormField label="품종" optional>
            <input
              type="text"
              value={breed}
              onChange={e => setBreed(e.target.value)}
              placeholder="예: 말티즈, 코리안숏헤어"
              className="h-12 w-full rounded-xl border border-border bg-card px-4 text-foreground transition-colors placeholder:text-muted-foreground focus:border-[oklch(0.72_0.18_42)] focus:outline-none"
            />
          </FormField>

          <FormField label="성별" optional>
            <div className="flex gap-3">
              {(
                [
                  { val: 'male' as Gender, label: '남아 ♂' },
                  { val: 'female' as Gender, label: '여아 ♀' },
                ] as { val: Gender; label: string }[]
              ).map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => setGender(gender === val ? null : val)}
                  className={cn(
                    'h-12 flex-1 rounded-xl border-2 text-sm font-medium transition-all',
                    gender === val
                      ? 'border-[oklch(0.72_0.18_42)] bg-[oklch(0.72_0.18_42/12%)] text-[oklch(0.72_0.18_42)]'
                      : 'border-border bg-card text-foreground'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="생년월일" optional>
            <input
              type="date"
              value={birthday}
              onChange={e => setBirthday(e.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-card px-4 text-foreground transition-colors focus:border-[oklch(0.72_0.18_42)] focus:outline-none"
            />
          </FormField>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="px-5 pt-4 pb-10">
        <Button
          onClick={handleSave}
          disabled={!name.trim()}
          className="h-13 w-full rounded-2xl bg-[oklch(0.72_0.18_42)] text-base font-semibold text-[oklch(0.985_0.001_106.423)] hover:bg-[oklch(0.65_0.18_42)]"
        >
          저장하기
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

function FormField({
  label,
  required,
  optional,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-[oklch(0.72_0.18_42)]">*</span>}
        {optional && <span className="ml-1 text-xs text-muted-foreground">(선택)</span>}
      </label>
      {children}
    </div>
  );
}
