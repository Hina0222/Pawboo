import type { PostItem } from '@pawboo/schemas/post';

export function groupPostsByDate(posts: PostItem[]): Record<string, PostItem> {
  return posts.reduce(
    (acc, post) => {
      const key = post.createdAt.slice(0, 10);
      if (!acc[key]) acc[key] = post;
      return acc;
    },
    {} as Record<string, PostItem>
  );
}
