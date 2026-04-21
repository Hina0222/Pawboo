import { Injectable, BadRequestException } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PetRepository } from '../pet/pet.repository';
import { AwsService, IMAGE_PRESET } from '../aws/aws.service';
import type { PostResponse } from '@pawboo/schemas/mission';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly petRepository: PetRepository,
    private readonly awsService: AwsService,
  ) {}

  async createPost(
    userId: number,
    imageBuffers: Buffer[],
  ): Promise<PostResponse> {
    const representativePet =
      await this.petRepository.findRepresentativeByUserId(userId);
    if (!representativePet) {
      throw new BadRequestException('대표 펫이 없습니다.');
    }

    const imageUrls = await Promise.all(
      imageBuffers.map((buf) =>
        this.awsService.uploadImage(buf, IMAGE_PRESET.POST),
      ),
    );

    try {
      return await this.postRepository.createPost({
        petId: representativePet.id,
        type: 'general',
        missionId: null,
        imageUrls,
      });
    } catch (err) {
      await Promise.all(
        imageUrls.map((url) => this.awsService.deleteImage(url)),
      );
      throw err;
    }
  }
}
