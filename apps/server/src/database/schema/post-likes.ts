import {
  pgTable,
  serial,
  integer,
  timestamp,
  unique,
  index,
} from 'drizzle-orm/pg-core';
import { posts } from './posts';
import { users } from './users';

export const postLikes = pgTable(
  'post_likes',
  {
    id: serial('id').primaryKey(),
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_post_like_post').on(table.postId),
    unique('idx_post_like_unique').on(table.postId, table.userId),
  ],
);
