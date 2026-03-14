import {
  pgTable,
  serial,
  integer,
  varchar,
  jsonb,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { missions } from './missions';
import { pets } from './pets';

export const missionSubmissions = pgTable(
  'mission_submissions',
  {
    id: serial('id').primaryKey(),
    missionId: integer('mission_id')
      .notNull()
      .references(() => missions.id, { onDelete: 'restrict' }),
    petId: integer('pet_id')
      .notNull()
      .references(() => pets.id, { onDelete: 'cascade' }),
    imageUrl: varchar('image_url', { length: 500 }).notNull(),
    comment: varchar('comment', { length: 150 }),
    hashtags: jsonb('hashtags').$type<string[]>(),
    likeCount: integer('like_count').default(0).notNull(),
    commentCount: integer('comment_count').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    unique('mission_submissions_mission_pet_unique').on(
      table.missionId,
      table.petId,
    ),
  ],
);
