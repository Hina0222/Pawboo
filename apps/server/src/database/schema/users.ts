import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import type { InferSelectModel } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  kakaoId: varchar('kakao_id', { length: 64 }).notNull().unique(),
  refreshToken: varchar('refresh_token', { length: 512 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type UserRecord = InferSelectModel<typeof users>;
