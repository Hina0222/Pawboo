'use client';

import { Link } from '@/app/i18n/navigation';
import { useLogoutMutation } from '@/features/user/me/api/useLogoutMutation';
import { useDeleteAccountMutation } from '@/features/user/me/api/useDeleteAccountMutation';
import MyPetList from './ui/my-pet-list';
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
import RightArrowIcon from '@/shared/assets/icons/RightArrowIcon.svg';

export default function MyPage() {
  const { mutate: logout, isPending } = useLogoutMutation();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccountMutation();
  const ts = useTranslations('settings');

  return (
    <>
      <Header>
        <Header.Left>
          <Header.Back />
        </Header.Left>
        <Header.Center>
          <Header.Title>내 프로필</Header.Title>
        </Header.Center>
      </Header>

      <main className="mt-5 flex flex-1 flex-col gap-10">
        <section className="pl-4">
          <MyPetList />
        </section>

        <section className="flex flex-1 flex-col items-center justify-between px-4">
          {/* 좋아요한 게시물 */}
          <div className="w-full">
            <Link
              href="/my/liked"
              className="flex w-full items-center gap-3 rounded-[18px] bg-[#333333] py-4 pr-4 pl-6"
            >
              <span className="flex-1">좋아요 목록</span>
              <RightArrowIcon />
            </Link>

            {/* 로그아웃 */}
            <button
              onClick={() => logout()}
              disabled={isPending}
              className="mt-4 flex w-full items-center gap-3 rounded-[18px] bg-[#333333] py-4 pr-4 pl-6"
            >
              {isPending ? ts('loggingOut') : ts('logout')}
            </button>
          </div>

          {/* 탈퇴 */}
          <Dialog>
            <DialogTrigger asChild>
              <button disabled={isDeleting} className="mb-6 font-medium text-[#E1E1E3] underline">
                계정 탈퇴
              </button>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
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
        </section>
      </main>
    </>
  );
}
