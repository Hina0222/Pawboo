import { Header } from '@/widgets/header';
import { PetSearch } from '@/features/pet/search/ui';

export default function SearchPage() {
  return (
    <>
      <Header>
        <Header.Left>
          <Header.Back />
        </Header.Left>
      </Header>
      <PetSearch />
    </>
  );
}
