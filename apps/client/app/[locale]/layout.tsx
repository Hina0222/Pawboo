import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/app/i18n/routing';
import '@/app/styles/globals.css';
import { QueryProvider } from '@/app/providers';
import { Toaster } from '@/shared/ui';

const pretendard = localFont({
  src: '../../src/app/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
});

export const metadata: Metadata = {
  title: 'Pawboo',
  description: 'Pawboo',
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${pretendard.className} dark antialiased`}>
        <div className="mx-auto flex h-full min-h-svh max-w-[390px] flex-col">
          <NextIntlClientProvider messages={messages}>
            <QueryProvider>{children}</QueryProvider>
          </NextIntlClientProvider>
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
