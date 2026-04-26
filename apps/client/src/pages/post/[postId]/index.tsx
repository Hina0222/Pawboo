import { Header } from '@/widgets/header';
import { PostDetail } from '@/features/post/detail/ui';
import { ServerFetchBoundary } from '@/shared/boundary/server-fetch-boundary';
import { getPostQueryOptions } from '@/features/post/detail/api/useGetPostQuery';

interface PostPageProps {
  params: Promise<{ postId: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { postId: postIdParam } = await params;
  const postId = Number(postIdParam);

  return (
    <div className="flex flex-col">
      <Header>
        <Header.Left>
          <Header.Back />
        </Header.Left>
      </Header>
      <ServerFetchBoundary queryOptions={getPostQueryOptions(postId)}>
        <PostDetail id={postId} />
      </ServerFetchBoundary>
    </div>
  );
}
