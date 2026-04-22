import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AwsService, IMAGE_PRESET } from '../aws/aws.service';
import { PetRepository } from './pet.repository';
import type {
  CreatePetRequest,
  UpdatePetRequest,
  PetResponse,
  PetSearchResponse,
  PetSearchQuery,
} from '@pawboo/schemas/pet';

@Injectable()
export class PetService {
  constructor(
    private readonly petRepository: PetRepository,
    private readonly awsService: AwsService,
  ) {}

  async create(
    userId: number,
    input: CreatePetRequest,
    imageBuffer?: Buffer,
  ): Promise<PetResponse> {
    const existing = await this.petRepository.findAllByUserId(userId);
    if (existing.length >= 5) {
      throw new BadRequestException('펫은 최대 5마리까지 등록할 수 있습니다.');
    }

    const imageUrl = imageBuffer
      ? await this.awsService.uploadImage(
          imageBuffer,
          IMAGE_PRESET.PET_THUMBNAIL,
        )
      : null;
    const isFirst = existing.length === 0;

    try {
      return await this.petRepository.create({
        userId,
        name: input.name,
        imageUrl,
        isRepresentative: isFirst,
      });
    } catch (err) {
      if (imageUrl) await this.awsService.deleteImage(imageUrl);
      throw err;
    }
  }

  async findAllByUser(userId: number): Promise<PetResponse[]> {
    return this.petRepository.findAllByUserId(userId);
  }

  async findOne(userId: number, petId: number): Promise<PetResponse> {
    const pet = await this.petRepository.findByIdAndUserId(petId, userId);
    if (!pet) throw new NotFoundException('펫을 찾을 수 없습니다.');
    return pet;
  }

  async update(
    userId: number,
    petId: number,
    input: UpdatePetRequest,
    imageBuffer?: Buffer,
  ): Promise<PetResponse> {
    const pet = await this.findOne(userId, petId);

    const newImageUrl = imageBuffer
      ? await this.awsService.uploadImage(
          imageBuffer,
          IMAGE_PRESET.PET_THUMBNAIL,
        )
      : null;

    const updateData: Partial<{ name: string; imageUrl: string | null }> = {
      imageUrl: newImageUrl ?? pet.imageUrl,
    };
    if (input.name !== undefined) updateData.name = input.name;

    let updated: PetResponse;
    try {
      updated = await this.petRepository.update(petId, updateData);
    } catch (err) {
      if (newImageUrl) await this.awsService.deleteImage(newImageUrl);
      throw err;
    }

    if (newImageUrl && pet.imageUrl) {
      await this.awsService.deleteImage(pet.imageUrl);
    }
    return updated;
  }

  async remove(userId: number, petId: number): Promise<void> {
    const pet = await this.findOne(userId, petId);

    if (pet.imageUrl) await this.awsService.deleteImage(pet.imageUrl);
    await this.petRepository.deleteById(petId);

    if (pet.isRepresentative) {
      const remaining = await this.petRepository.findAllByUserId(userId);
      if (remaining.length > 0) {
        await this.petRepository.setRepresentative(userId, remaining[0].id);
      }
    }
  }

  async setRepresentative(userId: number, petId: number): Promise<PetResponse> {
    const target = await this.findOne(userId, petId);
    if (target.isRepresentative) return target;

    return this.petRepository.setRepresentative(userId, petId);
  }

  async findRepresentative(userId: number) {
    return this.petRepository.findRepresentativeByUserId(userId);
  }

  async search(query: PetSearchQuery): Promise<PetSearchResponse> {
    return this.petRepository.searchByName(query.q, query.cursor, query.limit);
  }
}
