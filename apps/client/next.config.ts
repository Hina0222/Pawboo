import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
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

export default nextConfig;
