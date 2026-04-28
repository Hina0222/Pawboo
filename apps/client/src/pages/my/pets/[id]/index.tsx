'use client';

import { useParams } from 'next/navigation';
import { EditPetForm } from '@/features/pet/edit/ui';
import { Header } from '@/widgets/header';
import { useDeletePetMutation } from '@/features/pet/delete/api/useDeletePetMutation';
import { useRouter } from '@/app/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import TrashIcon from '@/shared/assets/icons/TrashIcon.svg';

export default function MyPetPage() {
  const params = useParams();
  const id = Number(params!.id);
  const router = useRouter();
  const { mutate: deletePet } = useDeletePetMutation();

  return (
    <>
      <Header>
        <Header.Left>
          <Header.Back />
        </Header.Left>
        <Header.Center>
          <Header.Title>프로필 편집</Header.Title>
        </Header.Center>
        <Header.Right>
          <button
            onClick={() => {
              deletePet(id, { onSuccess: () => router.back() });
            }}
            className={cn(
              'flex items-center justify-center rounded-full bg-[#333333CC] px-3.5 py-2.5'
            )}
          >
            <TrashIcon />
          </button>
        </Header.Right>
      </Header>

      <EditPetForm id={id} />
    </>
  );
}
