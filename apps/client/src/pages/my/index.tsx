'use client';

import { LogOut } from 'lucide-react';
import { Link } from '@/app/i18n/navigation';
import { useLogoutMutation } from '@/features/user/me/api/useLogoutMutation';
import { useDeleteAccountMutation } from '@/features/user/me/api/useDeleteAccountMutation';
import { MyPetList } from '@/widgets/pet';
import { Header } from '@/widgets/header';
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

export default function MyPage() {
  const { mutate: logout, isPending } = useLogoutMutation();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccountMutation();
  const t = useTranslations('my');
  const ts = useTranslations('settings');

  return (
    <div>
      <Header>
        <Header.Left>
          <Header.Back />
        </Header.Left>
        <Header.Center>
          <Header.Title>내 정보</Header.Title>
        </Header.Center>
        <Header.Right />
      </Header>

      {/* 내 펫 가로 스크롤 */}
      <section className="px-5 py-6">
        <h2 className="mb-3 text-sm font-semibold text-foreground">{t('myPets')}</h2>
        <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-1">
          <MyPetList />
          <Link href="/my/pets/new" className="flex flex-shrink-0 flex-col items-center gap-1.5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-border bg-card text-muted-foreground transition-colors hover:border-primary/50">
              <span className="text-xl">+</span>
            </div>
            <span className="text-xs text-muted-foreground">{t('add')}</span>
          </Link>
        </div>
      </section>

      {/* 로그아웃 */}
      <div className="px-5 pt-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <button
            onClick={() => logout()}
            disabled={isPending}
            className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-secondary disabled:opacity-50"
          >
            <LogOut size={18} className="flex-shrink-0 text-destructive" />
            <span className="flex-1 text-sm text-destructive">
              {isPending ? ts('loggingOut') : ts('logout')}
            </span>
          </button>
        </div>
      </div>

      {/* 탈퇴 */}
      <div className="px-5 pt-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={isDeleting}
              className="ml-auto w-fit text-xs text-muted-foreground hover:bg-transparent hover:text-muted-foreground"
            >
              {isDeleting ? ts('deleting') : ts('deleteAccount')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{ts('deleteAccount')}</DialogTitle>
              <DialogDescription>{ts('deleteConfirmMessage')}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="outline" disabled={isDeleting}>
                  {ts('cancel')}
                </Button>
              </DialogClose>
              <Button variant="destructive" onClick={() => deleteAccount()} disabled={isDeleting}>
                {isDeleting ? ts('deleting') : ts('deleteButton')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
