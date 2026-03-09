'use client';

export default function SigninPage() {
  const handleKakaoLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/kakao`;
  };

  return (
    <>
      {/* 상단 여백 + 로고 영역 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-10 px-8">
        {/* 로고 */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-[oklch(0.268_0.007_34.298)] text-5xl shadow-lg">
            🐾
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[oklch(0.72_0.18_42)]">
              BRAGram
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              반려동물과 함께하는
              <br />
              특별한 순간을 기록해요
            </p>
          </div>
        </div>

        {/* 피처 하이라이트 */}
        <div className="flex w-full flex-col gap-3">
          {[
            { emoji: '🎯', text: '매일 미션으로 포인트 적립' },
            { emoji: '📸', text: '반려동물 일상을 피드로 공유' },
            { emoji: '🏆', text: '랭킹으로 집사들과 경쟁' },
          ].map(({ emoji, text }) => (
            <div
              key={text}
              className="flex items-center gap-3 rounded-xl bg-[oklch(0.268_0.007_34.298)] px-4 py-3"
            >
              <span className="text-xl">{emoji}</span>
              <span className="text-sm text-foreground">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 로그인 버튼 */}
      <div className="flex flex-col gap-3 px-5 pt-6 pb-12">
        <button
          onClick={handleKakaoLogin}
          className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl text-base font-semibold transition-opacity active:opacity-80"
          style={{ backgroundColor: '#FEE500', color: '#191919' }}
        >
          <KakaoIcon />
          카카오로 시작하기
        </button>
        <p className="text-center text-xs text-muted-foreground">
          로그인 시 <span className="underline underline-offset-2">서비스 이용약관</span> 및{' '}
          <span className="underline underline-offset-2">개인정보처리방침</span>에 동의합니다
        </p>
      </div>
    </>
  );
}

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.477 2 10.804c0 2.745 1.617 5.158 4.058 6.605-.18.658-.647 2.38-.74 2.75-.116.46.17.455.358.33.148-.096 2.352-1.6 3.306-2.247.33.047.668.071 1.018.071 5.523 0 10-3.477 10-7.804C22 6.477 17.523 3 12 3z" />
    </svg>
  );
}
