import {
  pgTable,
  serial,
  integer,
  timestamp,
  pgEnum,
  unique,
} from 'drizzle-orm/pg-core';
import { posts } from './posts';
import { users } from './users';

export const reportReasonEnum = pgEnum('report_reason', [
  'inappropriate',
  'spam',
  'copyright',
]);

export const reports = pgTable(
  'reports',
  {
    id: serial('id').primaryKey(),
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    reporterId: integer('reporter_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    reason: reportReasonEnum('reason').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    unique('reports_post_reporter_unique').on(table.postId, table.reporterId),
  ],
);
