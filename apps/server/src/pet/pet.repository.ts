import { Injectable, Inject } from '@nestjs/common';
import { eq, and, asc, desc, count, ilike, gt } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../database/database.provider';
import type { DrizzleDB } from '../database/database.provider';
import { pets } from '../database/schema';
import type { PetResponse, PetSearchResponse } from '@pawboo/schemas/pet';

@Injectable()
export class PetRepository {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: DrizzleDB) {}

  async findAllByUserId(userId: number): Promise<PetResponse[]> {
    return this.db
      .select()
      .from(pets)
      .where(eq(pets.userId, userId))
      .orderBy(desc(pets.isRepresentative), asc(pets.createdAt));
  }

  async findById(petId: number): Promise<PetResponse | null> {
    const [pet] = await this.db.select().from(pets).where(eq(pets.id, petId));
    return pet ?? null;
  }

  async findByIdAndUserId(
    petId: number,
    userId: number,
  ): Promise<PetResponse | null> {
    const [pet] = await this.db
      .select()
      .from(pets)
      .where(and(eq(pets.id, petId), eq(pets.userId, userId)));
    return pet ?? null;
  }

  async findRepresentativeByUserId(
    userId: number,
  ): Promise<PetResponse | null> {
    const [pet] = await this.db
      .select()
      .from(pets)
      .where(and(eq(pets.userId, userId), eq(pets.isRepresentative, true)));
    return pet ?? null;
  }

  async create(data: {
    userId: number;
    name: string;
    imageUrl: string | null;
    isRepresentative: boolean;
  }): Promise<PetResponse> {
    const [pet] = await this.db.insert(pets).values(data).returning();
    return pet;
  }

  async update(
    petId: number,
    data: Partial<{ name: string; imageUrl: string | null }>,
  ): Promise<PetResponse> {
    const [updated] = await this.db
      .update(pets)
      .set(data)
      .where(eq(pets.id, petId))
      .returning();
    return updated;
  }

  async deleteById(petId: number): Promise<void> {
    await this.db.delete(pets).where(eq(pets.id, petId));
  }

  async setRepresentative(userId: number, petId: number): Promise<PetResponse> {
    const [updated] = await this.db.transaction(async (tx) => {
      await tx
        .update(pets)
        .set({ isRepresentative: false })
        .where(and(eq(pets.userId, userId), eq(pets.isRepresentative, true)));

      const result = await tx
        .update(pets)
        .set({ isRepresentative: true })
        .where(eq(pets.id, petId))
        .returning();

      return result;
    });

    return updated;
  }

  async searchByName(
    q: string,
    cursor?: number,
    limit: number = 20,
  ): Promise<PetSearchResponse> {
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

  async countByUserId(userId: number): Promise<number> {
    const [{ count: total }] = await this.db
      .select({ count: count() })
      .from(pets)
      .where(eq(pets.userId, userId));
    return total;
  }
}
