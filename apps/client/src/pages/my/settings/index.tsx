'use client';

import { ChevronLeft, ChevronRight, LogOut, User } from 'lucide-react';
import { useRouter } from '@/app/i18n/navigation';
import { useMeQuery } from '@/features/user/me/api/useMeQuery';
import { useLogoutMutation } from '@/features/user/me/api/useLogoutMutation';
import { useDeleteAccountMutation } from '@/features/user/me/api/useDeleteAccountMutation';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
} from '@/shared/ui';
import { useTranslations } from 'next-intl';

export default function MySettingsPage() {
  const router = useRouter();
  const { data: user } = useMeQuery();
  const { mutate: logout, isPending } = useLogoutMutation();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccountMutation();
  const t = useTranslations('settings');

  const SECTIONS = [
    {
      title: t('account'),
      items: [
        { icon: User, label: t('editProfile'), action: 'profile', href: '/my/settings/profile' },
      ],
    },
  ];

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
        <h1 className="text-base font-semibold text-foreground">{t('title')}</h1>
      </header>

      {/* 프로필 요약 */}
      <div className="mx-5 mb-6 flex items-center gap-4 rounded-2xl border border-border bg-card px-4 py-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-3xl">
          🐾
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {user?.nickname ?? t('defaultNickname')}
          </p>
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
                  className={`flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-secondary ${
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
              className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-secondary disabled:opacity-50"
            >
              <LogOut size={18} className="flex-shrink-0 text-destructive" />
              <span className="flex-1 text-sm text-destructive">
                {isPending ? t('loggingOut') : t('logout')}
              </span>
            </button>
          </div>
        </div>

        {/* 탈퇴 */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={isDeleting}
              className="ml-auto w-fit text-xs text-muted-foreground hover:bg-transparent hover:text-muted-foreground"
            >
              {isDeleting ? t('deleting') : t('deleteAccount')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('deleteAccount')}</DialogTitle>
              <DialogDescription>{t('deleteConfirmMessage')}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="outline" disabled={isDeleting}>
                  {t('cancel')}
                </Button>
              </DialogClose>
              <Button variant="destructive" onClick={() => deleteAccount()} disabled={isDeleting}>
                {isDeleting ? t('deleting') : t('deleteButton')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 버전 정보 */}
        <p className="pb-8 text-center text-xs text-muted-foreground">Pawboo v0.1.0</p>
      </div>
    </>
  );
}
