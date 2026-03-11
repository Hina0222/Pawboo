import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/app/styles/globals.css';
import { QueryProvider } from '@/app/providers';
import { AuthInitializer } from '@/app/providers/auth-initializer';
import { Toaster } from '@/shared/ui';

const pretendard = localFont({
  src: '../src/app/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
});

export const metadata: Metadata = {
  title: 'BRAGram',
  description: 'BRAGram description',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.className} dark antialiased`}>
        <div className="mx-auto flex h-full min-h-dvh max-w-[390px] flex-col">
          <QueryProvider>
            <AuthInitializer>{children}</AuthInitializer>
          </QueryProvider>
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
