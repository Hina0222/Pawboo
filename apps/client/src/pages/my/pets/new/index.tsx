import { CreatePetForm } from '@/features/pet/create/ui';
import { Header } from '@/widgets/header';

export default function NewPetPage() {
  return (
    <>
      <Header>
        <Header.Left>
          <Header.Back />
        </Header.Left>
        <Header.Center>
          <Header.Title>프로필 추가</Header.Title>
        </Header.Center>
      </Header>
      <CreatePetForm />
    </>
  );
}
