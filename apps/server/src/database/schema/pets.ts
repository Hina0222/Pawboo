import {
  pgTable,
  serial,
  integer,
  varchar,
  boolean,
  date,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const petTypeEnum = pgEnum('pet_type', ['cat', 'dog']);
export const petGenderEnum = pgEnum('pet_gender', ['male', 'female']);

export const pets = pgTable('pets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 15 }).notNull(),
  type: petTypeEnum('type').notNull(),
  breed: varchar('breed', { length: 50 }),
  birthDate: date('birth_date'),
  gender: petGenderEnum('gender'),
  bio: varchar('bio', { length: 60 }),
  imageUrl: varchar('image_url', { length: 500 }),
  isActive: boolean('is_active').notNull().default(false),
  score: integer('score').notNull().default(0),
  weeklyScore: integer('weekly_score').notNull().default(0),
  monthlyScore: integer('monthly_score').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
