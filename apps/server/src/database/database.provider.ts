import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export const DRIZZLE_ORM = Symbol('DRIZZLE_ORM');

export type DrizzleDB = PostgresJsDatabase<typeof schema>;

export const databaseProvider: Provider = {
  provide: DRIZZLE_ORM,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const connectionString = configService.get<string>('DATABASE_URL');

    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined');
    }

    const client = postgres(connectionString);
    const db = drizzle(client, { schema });

    console.log('✅ Database connected successfully');

    return db;
  },
};
