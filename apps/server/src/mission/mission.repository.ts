import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../database/database.provider';
import type { DrizzleDB } from '../database/database.provider';
import { missions } from '../database/schema';

@Injectable()
export class MissionRepository {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: DrizzleDB) {}

  async findByDate(date: string) {
    const [mission] = await this.db
      .select()
      .from(missions)
      .where(eq(missions.scheduledAt, date));
    return mission ?? null;
  }

  async findById(missionId: number) {
    const [mission] = await this.db
      .select()
      .from(missions)
      .where(eq(missions.id, missionId));
    return mission ?? null;
  }
}
