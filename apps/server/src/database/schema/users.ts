import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  kakaoId: varchar('kakao_id', { length: 64 }).notNull().unique(),
  nickname: varchar('nickname', { length: 20 }).unique(),
  profileImage: varchar('profile_image', { length: 500 }),
  refreshToken: varchar('refresh_token', { length: 512 }),
  followerCount: integer('follower_count').default(0).notNull(),
  followingCount: integer('following_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
