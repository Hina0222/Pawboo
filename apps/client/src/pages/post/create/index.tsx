import { Header } from '@/widgets/header';
import { CreatePostForm } from '@/features/post/create/ui';

export default function PostCreatePage() {
  return (
    <>
      <Header>
        <Header.Left>
          <Header.Back />
        </Header.Left>
        <Header.Center>
          <Header.Title>게시글 작성</Header.Title>
        </Header.Center>
      </Header>
      <CreatePostForm />
    </>
  );
}
