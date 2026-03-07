import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Database
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.string().default('5432'),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  DATABASE_URL: z.url(),
});

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: (config: Record<string, unknown>) => {
        try {
          return envSchema.parse(config);
        } catch (error) {
          console.error('Environment validation error:', error);
          throw error;
        }
      },
    }),
  ],
})
export class ConfigModule {}
