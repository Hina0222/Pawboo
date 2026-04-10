import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/app/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL!,
      },
      // TODO : 나중에 제거 (유저 이미지 처리 한 후)
      {
        protocol: 'http',
        hostname: 'img1.kakaocdn.net',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
