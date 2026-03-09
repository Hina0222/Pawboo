'use client';

import { useState, useRef } from 'react';
import { Button } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import { ChevronLeft, Camera } from 'lucide-react';
import Image from 'next/image';

type PetType = 'cat' | 'dog' | null;
type Gender = 'male' | 'female' | null;

interface PetForm {
  type: PetType;
  name: string;
  breed: string;
  gender: Gender;
  birthday: string;
  photo: string | null;
}

const TOTAL_STEPS = 4;

export default function OnboardingPetPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<PetForm>({
    type: null,
    name: '',
    breed: '',
    gender: null,
    birthday: '',
    photo: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canNext = () => {
    if (step === 2) return form.type !== null;
    if (step === 3) return form.name.trim() !== '';
    return true;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(s => s + 1);
    else handleSubmit();
  };

  const handleSubmit = () => {
    // TODO: API 연동 — POST /pets
    console.log('펫 등록 데이터:', form);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm(f => ({ ...f, photo: url }));
  };

  return (
    <>
      {/* 상단 헤더 */}
      <header className="flex items-center px-5 pt-12 pb-4">
        {step > 1 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft size={24} />
          </button>
        )}
      </header>

      {/* 진행 바 */}
      {step > 1 && (
        <div className="mb-8 flex gap-1.5 px-5">
          {Array.from({ length: TOTAL_STEPS - 1 }, (_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors duration-300',
                i < step - 1 ? 'bg-[oklch(0.72_0.18_42)]' : 'bg-border'
              )}
            />
          ))}
        </div>
      )}

      {/* 콘텐츠 */}
      <div className="flex flex-1 flex-col px-5">
        {step === 1 && <StepWelcome />}
        {step === 2 && (
          <StepPetType selected={form.type} onSelect={type => setForm(f => ({ ...f, type }))} />
        )}
        {step === 3 && (
          <StepBasicInfo
            form={form}
            onChange={(key, val) => setForm(f => ({ ...f, [key]: val }))}
          />
        )}
        {step === 4 && (
          <StepPhoto photo={form.photo} onFileClick={() => fileInputRef.current?.click()} />
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="px-5 pt-4 pb-10">
        <Button
          className="h-13 w-full rounded-2xl bg-[oklch(0.72_0.18_42)] text-base font-semibold text-[oklch(0.985_0.001_106.423)] hover:bg-[oklch(0.65_0.18_42)]"
          onClick={handleNext}
          disabled={!canNext()}
        >
          {step === 1 ? '시작하기' : step === TOTAL_STEPS ? '완료하기' : '다음'}
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

function StepWelcome() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 pb-20 text-center">
      <div className="text-7xl">🐾</div>
      <div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">BRAGram</h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          반려동물과 함께하는 특별한 순간을
          <br />
          기록하고 공유해보세요
        </p>
      </div>
      <div className="mt-4 rounded-2xl bg-[oklch(0.72_0.18_42/12%)] p-4 text-sm leading-relaxed text-[oklch(0.72_0.18_42)]">
        🐶 내 반려동물을 등록하고
        <br />
        미션을 완료하며 포인트를 쌓아보세요!
      </div>
    </div>
  );
}

function StepPetType({
  selected,
  onSelect,
}: {
  selected: PetType;
  onSelect: (t: PetType) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">어떤 반려동물인가요?</h2>
        <p className="text-sm text-muted-foreground">반려동물 종류를 선택해주세요</p>
      </div>
      <div className="mt-4 flex gap-4">
        {(
          [
            { type: 'dog' as PetType, emoji: '🐶', label: '강아지' },
            { type: 'cat' as PetType, emoji: '🐱', label: '고양이' },
          ] as { type: PetType; emoji: string; label: string }[]
        ).map(({ type, emoji, label }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border-2 py-10 transition-all duration-200',
              selected === type
                ? 'border-[oklch(0.72_0.18_42)] bg-[oklch(0.72_0.18_42/12%)]'
                : 'border-border bg-card hover:border-[oklch(0.72_0.18_42/50%)]'
            )}
          >
            <span className="text-5xl">{emoji}</span>
            <span
              className={cn(
                'text-base font-semibold',
                selected === type ? 'text-[oklch(0.72_0.18_42)]' : 'text-foreground'
              )}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepBasicInfo({
  form,
  onChange,
}: {
  form: PetForm;
  onChange: (key: keyof PetForm, val: string | Gender) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">기본 정보</h2>
        <p className="text-sm text-muted-foreground">반려동물에 대해 알려주세요</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* 이름 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            이름 <span className="text-[oklch(0.72_0.18_42)]">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e => onChange('name', e.target.value)}
            placeholder="반려동물 이름"
            className="h-12 w-full rounded-xl border border-border bg-card px-4 text-foreground transition-colors placeholder:text-muted-foreground focus:border-[oklch(0.72_0.18_42)] focus:outline-none"
          />
        </div>

        {/* 품종 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            품종 <span className="text-xs text-muted-foreground">(선택)</span>
          </label>
          <input
            type="text"
            value={form.breed}
            onChange={e => onChange('breed', e.target.value)}
            placeholder="예: 말티즈, 코리안숏헤어"
            className="h-12 w-full rounded-xl border border-border bg-card px-4 text-foreground transition-colors placeholder:text-muted-foreground focus:border-[oklch(0.72_0.18_42)] focus:outline-none"
          />
        </div>

        {/* 성별 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            성별 <span className="text-xs text-muted-foreground">(선택)</span>
          </label>
          <div className="flex gap-3">
            {(
              [
                { val: 'male' as Gender, label: '남아 ♂' },
                { val: 'female' as Gender, label: '여아 ♀' },
              ] as { val: Gender; label: string }[]
            ).map(({ val, label }) => (
              <button
                key={val}
                onClick={() => onChange('gender', form.gender === val ? null : val)}
                className={cn(
                  'h-12 flex-1 rounded-xl border-2 text-sm font-medium transition-all',
                  form.gender === val
                    ? 'border-[oklch(0.72_0.18_42)] bg-[oklch(0.72_0.18_42/12%)] text-[oklch(0.72_0.18_42)]'
                    : 'border-border bg-card text-foreground'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 생년월일 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            생년월일 <span className="text-xs text-muted-foreground">(선택)</span>
          </label>
          <input
            type="date"
            value={form.birthday}
            onChange={e => onChange('birthday', e.target.value)}
            className="h-12 w-full rounded-xl border border-border bg-card px-4 text-foreground transition-colors focus:border-[oklch(0.72_0.18_42)] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function StepPhoto({ photo, onFileClick }: { photo: string | null; onFileClick: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-foreground">프로필 사진</h2>
        <p className="text-sm text-muted-foreground">
          반려동물 사진을 등록해주세요 <span className="text-xs">(선택)</span>
        </p>
      </div>

      <button
        onClick={onFileClick}
        className="relative mt-4 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[oklch(0.72_0.18_42/50%)] bg-card transition-colors hover:border-[oklch(0.72_0.18_42)]"
      >
        {photo ? (
          <Image
            src={photo}
            alt="펫 사진"
            className="h-full w-full object-cover"
            width={140}
            height={140}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Camera size={28} />
            <span className="text-xs">사진 추가</span>
          </div>
        )}
      </button>

      <p className="mt-2 text-center text-xs text-muted-foreground">
        탭하여 갤러리에서 사진을 선택하거나
        <br />
        카메라로 바로 촬영하세요
      </p>
    </div>
  );
}
