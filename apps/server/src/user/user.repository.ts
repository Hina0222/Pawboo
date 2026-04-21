import { Injectable, Inject } from '@nestjs/common';
import { eq, ilike, and, gt } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../database/database.provider';
import type { DrizzleDB } from '../database/database.provider';
import { users, pets } from '../database/schema';
import type { UserRecord } from '../database/schema';

@Injectable()
export class UserRepository {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: DrizzleDB) {}

  async findByKakaoId(kakaoId: string): Promise<UserRecord | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.kakaoId, kakaoId));
    return user ?? null;
  }

  async findById(id: number): Promise<UserRecord | null> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user ?? null;
  }

  async create(kakaoId: string): Promise<UserRecord> {
    const [user] = await this.db.insert(users).values({ kakaoId }).returning();
    return user;
  }

  async updateRefreshToken(id: number, refreshToken: string | null) {
    await this.db.update(users).set({ refreshToken }).where(eq(users.id, id));
  }

  async deleteById(id: number) {
    await this.db.delete(users).where(eq(users.id, id));
  }

  async searchPetsByName(q: string, cursor?: number, limit: number = 20) {
    const rows = await this.db
      .select({
        id: pets.id,
        name: pets.name,
        imageUrl: pets.imageUrl,
      })
      .from(pets)
      .where(
        cursor
          ? and(ilike(pets.name, `%${q}%`), gt(pets.id, cursor))
          : ilike(pets.name, `%${q}%`),
      )
      .orderBy(pets.id)
      .limit(limit + 1);

    const hasNext = rows.length > limit;
    const data = hasNext ? rows.slice(0, limit) : rows;
    const lastItem = data[data.length - 1];

    return {
      data: data.map((r) => ({
        id: r.id,
        name: r.name,
        imageUrl: r.imageUrl ?? null,
      })),
      hasNext,
      cursor: hasNext && lastItem ? lastItem.id : null,
    };
  }
}
