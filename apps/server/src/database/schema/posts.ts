import {
  pgTable,
  serial,
  integer,
  jsonb,
  timestamp,
  pgEnum,
  unique,
  index,
} from 'drizzle-orm/pg-core';
import { pets } from './pets';
import { missions } from './missions';

export const postTypeEnum = pgEnum('post_type', ['general', 'mission']);

export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    petId: integer('pet_id')
      .notNull()
      .references(() => pets.id, { onDelete: 'cascade' }),
    type: postTypeEnum('type').notNull(),
    missionId: integer('mission_id').references(() => missions.id, {
      onDelete: 'restrict',
    }),
    imageUrls: jsonb('image_urls').notNull().$type<string[]>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_post_created').on(table.createdAt),
    index('idx_post_pet_created').on(table.petId, table.createdAt),
    index('idx_post_mission_created').on(table.missionId, table.createdAt),
    unique('posts_pet_mission_unique').on(table.petId, table.missionId),
  ],
);
