'use client';

import { ChevronLeft, ChevronRight, Bell, Shield, HelpCircle, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import { useAuthStore } from '@/shared/store/auth-store';

const SECTIONS = [
  {
    title: '계정',
    items: [{ icon: User, label: '프로필 편집', action: 'profile', href: '/my/settings/profile' }],
  },
  {
    title: '알림',
    items: [{ icon: Bell, label: '알림 설정', action: 'notifications', href: '' }],
  },
  {
    title: '기타',
    items: [
      { icon: Shield, label: '개인정보처리방침', action: 'privacy', href: '' },
      { icon: HelpCircle, label: '고객센터', action: 'help', href: '' },
    ],
  },
];

export default function MySettingsPage() {
  const router = useRouter();
  const { clearAuth, user } = useAuthStore();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: () => apiClient.post('/auth/logout'),
    onSettled: () => {
      clearAuth();
      router.replace('/signin');
    },
  });

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
        <h1 className="text-base font-semibold text-foreground">설정</h1>
      </header>

      {/* 프로필 요약 */}
      <div className="mx-5 mb-6 flex items-center gap-4 rounded-2xl border border-border bg-card px-4 py-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[oklch(0.268_0.007_34.298)] text-3xl">
          🐾
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{user?.nickname ?? '집사님'}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {user?.nickname ? `@${user.nickname}` : ''}
          </p>
        </div>
      </div>

      {/* 설정 섹션들 */}
      <div className="flex flex-col gap-5 px-5">
        {SECTIONS.map(section => (
          <div key={section.title}>
            <p className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              {section.title}
            </p>
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {section.items.map((item, idx) => (
                <button
                  key={item.action}
                  onClick={() => item.href && router.push(item.href)}
                  className={`flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-[oklch(0.268_0.007_34.298)] ${
                    idx < section.items.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <item.icon size={18} className="flex-shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-sm text-foreground">{item.label}</span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* 로그아웃 */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <button
              onClick={() => logout()}
              disabled={isPending}
              className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-[oklch(0.268_0.007_34.298)] disabled:opacity-50"
            >
              <LogOut size={18} className="flex-shrink-0 text-destructive" />
              <span className="flex-1 text-sm text-destructive">
                {isPending ? '로그아웃 중...' : '로그아웃'}
              </span>
            </button>
          </div>
        </div>

        {/* 버전 정보 */}
        <p className="pb-8 text-center text-xs text-muted-foreground">BRAGram v0.1.0</p>
      </div>
    </>
  );
}
