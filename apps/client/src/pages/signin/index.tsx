'use client';

import { useTranslations } from 'next-intl';
import LoginLogoImg from '@/shared/assets/images/LoginLogoImg.png';
import LoginMainImg from '@/shared/assets/images/LoginMainImg.png';
import KakaoIcon from '@/shared/assets/icons/KakaoIcon.svg';
import { Link } from '@/app/i18n/navigation';

export default function SigninPage() {
  const t = useTranslations('signin');
  const handleKakaoLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/kakao`;
  };

  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center gap-10">
        {/* 로고 */}
        <div>
          <img src={LoginLogoImg.src} alt="LoginLogoImg" className={'h-full w-full object-cover'} />
        </div>

        {/* 피처 하이라이트 */}
        <div>
          <img src={LoginMainImg.src} alt="LoginLogoImg" className={'h-full w-full object-cover'} />
        </div>
      </div>

      {/* 하단 로그인 버튼 */}
      <div className="flex flex-col gap-4 px-4">
        <button
          onClick={handleKakaoLogin}
          className="flex w-full items-center justify-center gap-3 rounded-[16px] bg-[#FEE500] py-3 text-base font-semibold text-[#000000]"
        >
          <KakaoIcon />
          {t('kakaoLogin')}
        </button>
        <p className="text-center text-xs text-[#999999]">
          {t('termsPrefix')} <span className="underline underline-offset-2">{t('terms')}</span>{' '}
          <span className="underline underline-offset-2">{t('privacy')}</span>
          {t('termsSuffix')}
        </p>
      </div>

      <div className="mx-auto mt-7.5 mb-6">
        <Link href={'/'} className="text-[#E1E1E3] underline">
          먼저 둘러볼래요
        </Link>
      </div>
    </>
  );
}
