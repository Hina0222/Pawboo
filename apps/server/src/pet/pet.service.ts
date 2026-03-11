import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { eq, and, asc, desc } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../database/database.provider';
import type { DrizzleDB } from '../database/database.provider';
import { pets } from '../database/schema';
import { AwsService } from '../aws/aws.service';
import {
  CreatePetRequest,
  UpdatePetRequest,
  PetResponse,
} from '@bragram/schemas/pet';

@Injectable()
export class PetService {
  constructor(
    @Inject(DRIZZLE_ORM) private readonly db: DrizzleDB,
    private readonly awsService: AwsService,
  ) {}

  async create(
    userId: number,
    input: CreatePetRequest,
    imageBuffer?: Buffer,
  ): Promise<PetResponse> {
    const existing = await this.db
      .select({ id: pets.id })
      .from(pets)
      .where(eq(pets.userId, userId));

    if (existing.length >= 5) {
      throw new BadRequestException('펫은 최대 5마리까지 등록할 수 있습니다.');
    }

    const imageUrl = imageBuffer
      ? await this.awsService.uploadImage(imageBuffer, 'pets')
      : null;
    const isFirst = existing.length === 0;

    const [pet] = await this.db
      .insert(pets)
      .values({
        userId,
        name: input.name,
        type: input.type,
        breed: input.breed ?? null,
        birthDate: input.birthDate ?? null,
        gender: input.gender ?? null,
        bio: input.bio ?? null,
        imageUrl,
        isActive: isFirst,
      })
      .returning();

    return pet;
  }

  async findAllByUser(userId: number): Promise<PetResponse[]> {
    return this.db
      .select()
      .from(pets)
      .where(eq(pets.userId, userId))
      .orderBy(desc(pets.isActive), asc(pets.createdAt));
  }

  async findOne(userId: number, petId: number): Promise<PetResponse> {
    const [pet] = await this.db
      .select()
      .from(pets)
      .where(and(eq(pets.id, petId), eq(pets.userId, userId)));

    if (!pet) {
      throw new NotFoundException('펫을 찾을 수 없습니다.');
    }

    return pet;
  }

  async update(
    userId: number,
    petId: number,
    input: UpdatePetRequest,
    imageBuffer?: Buffer,
  ): Promise<PetResponse> {
    const pet = await this.findOne(userId, petId);

    let imageUrl = pet.imageUrl;
    if (imageBuffer) {
      imageUrl = await this.awsService.uploadImage(imageBuffer, 'pets');
      if (pet.imageUrl) await this.awsService.deleteImage(pet.imageUrl);
    }

    const [updated] = await this.db
      .update(pets)
      .set({
        ...(input.name !== undefined && { name: input.name }),
        ...(input.type !== undefined && { type: input.type }),
        ...(input.breed !== undefined && { breed: input.breed }),
        ...(input.birthDate !== undefined && { birthDate: input.birthDate }),
        ...(input.gender !== undefined && { gender: input.gender }),
        ...(input.bio !== undefined && { bio: input.bio }),
        imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(pets.id, petId))
      .returning();

    return updated;
  }

  async remove(userId: number, petId: number): Promise<void> {
    const pet = await this.findOne(userId, petId);

    if (pet.imageUrl) await this.awsService.deleteImage(pet.imageUrl);
    await this.db.delete(pets).where(eq(pets.id, petId));

    if (pet.isActive) {
      const [next] = await this.db
        .select()
        .from(pets)
        .where(eq(pets.userId, userId))
        .orderBy(asc(pets.createdAt))
        .limit(1);

      if (next) {
        await this.db
          .update(pets)
          .set({ isActive: true, updatedAt: new Date() })
          .where(eq(pets.id, next.id));
      }
    }
  }

  async activate(userId: number, petId: number): Promise<PetResponse> {
    const target = await this.findOne(userId, petId);

    if (target.isActive) {
      return target;
    }

    await this.db.transaction(async (tx) => {
      await tx
        .update(pets)
        .set({ isActive: false, updatedAt: new Date() })
        .where(and(eq(pets.userId, userId), eq(pets.isActive, true)));

      await tx
        .update(pets)
        .set({ isActive: true, updatedAt: new Date() })
        .where(eq(pets.id, petId));
    });

    const [updated] = await this.db
      .select()
      .from(pets)
      .where(eq(pets.id, petId));

    return updated;
  }
}
