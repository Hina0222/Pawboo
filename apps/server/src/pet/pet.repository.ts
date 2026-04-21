import { Injectable, Inject } from '@nestjs/common';
import { eq, and, asc, desc, count } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../database/database.provider';
import type { DrizzleDB } from '../database/database.provider';
import { pets } from '../database/schema';
import type { PetResponse } from '@pawboo/schemas/pet';

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

  async countByUserId(userId: number): Promise<number> {
    const [{ count: total }] = await this.db
      .select({ count: count() })
      .from(pets)
      .where(eq(pets.userId, userId));
    return total;
  }
}
