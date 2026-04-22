import {
  pgTable,
  serial,
  varchar,
  text,
  date,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { type InferSelectModel } from 'drizzle-orm';

export const missions = pgTable(
  'missions',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 100 }).notNull(),
    description: text('description').notNull(),
    exampleImageUrl: varchar('example_image_url', { length: 500 }),
    scheduledAt: date('scheduled_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [unique('missions_scheduled_at_unique').on(table.scheduledAt)],
);

export type MissionRecord = InferSelectModel<typeof missions>;
