import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/app/i18n/routing';

const PUBLIC_ROUTES = ['/signin', '/auth/callback', '/'];

const intlMiddleware = createIntlMiddleware(routing);

function stripLocalePrefix(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1);
    }
    if (pathname === `/${locale}`) {
      return '/';
    }
  }
  return pathname;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 파일 제외
  if (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp|ico)$/)
  ) {
    return NextResponse.next();
  }

  // API 라우트 제외
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // locale prefix를 제거한 경로로 인증 로직 판단
  const strippedPathname = stripLocalePrefix(pathname);

  const refreshToken = request.cookies.get('refreshToken')?.value;
  const isPublicRoute = PUBLIC_ROUTES.some(route => strippedPathname.startsWith(route));

  // 로그인 상태에서 /signin 접근 → / 리다이렉트
  if (refreshToken && strippedPathname === '/signin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 비로그인 상태에서 protected 라우트 접근 → /signin 리다이렉트
  if (!refreshToken && !isPublicRoute) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // i18n locale 처리
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
