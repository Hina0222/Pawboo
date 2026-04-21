import {
  pgTable,
  serial,
  integer,
  varchar,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

export const pets = pgTable(
  'pets',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 15 }).notNull(),
    imageUrl: varchar('image_url', { length: 500 }),
    isRepresentative: boolean('is_representative').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_pet_user').on(table.userId),
    uniqueIndex('idx_pet_representative_unique')
      .on(table.userId)
      .where(sql`${table.isRepresentative} = true`),
  ],
);
