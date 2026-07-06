import type { PostDetail } from '@pawboo/schemas/post';

import { toDateKey } from '../lib/calendar';

export function groupPostsByDate(posts: PostDetail[]): Record<string, PostDetail[]> {
  return posts.reduce(
    (acc, post) => {
      const key = toDateKey(new Date(post.createdAt));
      if (!acc[key]) acc[key] = [];
      acc[key].push(post);
      return acc;
    },
    {} as Record<string, PostDetail[]>
  );
}
