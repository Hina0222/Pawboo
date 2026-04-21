import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { MissionRepository } from './mission.repository';
import { PetRepository } from '../pet/pet.repository';
import { PostRepository } from '../post/post.repository';
import { AwsService, IMAGE_PRESET } from '../aws/aws.service';
import type {
  SubmissionHistoryQuery,
  PostResponse,
  SubmissionHistoryResponse,
  TodayMissionResponse,
} from '@pawboo/schemas/mission';

@Injectable()
export class MissionService {
  constructor(
    private readonly missionRepository: MissionRepository,
    private readonly petRepository: PetRepository,
    private readonly postRepository: PostRepository,
    private readonly awsService: AwsService,
  ) {}

  private getKstToday(): string {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul',
    }).format(new Date());
  }

  async findToday(userId: number): Promise<TodayMissionResponse> {
    const today = this.getKstToday();
    const mission = await this.missionRepository.findByDate(today);

    if (!mission) {
      return { mission: null, post: null };
    }

    const representativePet =
      await this.petRepository.findRepresentativeByUserId(userId);
    if (!representativePet) {
      return { mission, post: null };
    }

    const post = await this.postRepository.findByMissionIdAndPetId(
      mission.id,
      representativePet.id,
    );

    return { mission, post };
  }

  async submitMission(
    userId: number,
    missionId: number,
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
        type: 'mission',
        missionId,
        imageUrls,
      });
    } catch (err: unknown) {
      await Promise.all(
        imageUrls.map((url) => this.awsService.deleteImage(url)),
      );
      const pgErr = err as { cause?: { code?: string } };
      if (pgErr?.cause?.code === '23505') {
        throw new ConflictException('이미 제출된 미션입니다.');
      }
      throw err;
    }
  }

  async deleteSubmission(
    userId: number,
    missionId: number,
    postId: number,
  ): Promise<void> {
    const post = await this.postRepository.findById(postId);
    if (!post || post.missionId !== missionId) {
      throw new NotFoundException('제출 내역을 찾을 수 없습니다.');
    }

    const pet = await this.petRepository.findByIdAndUserId(post.petId, userId);
    if (!pet) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    await this.postRepository.deletePost(postId);
    await Promise.all(
      post.imageUrls.map((url) => this.awsService.deleteImage(url)),
    );
  }

  async findHistory(
    userId: number,
    query: SubmissionHistoryQuery,
  ): Promise<SubmissionHistoryResponse> {
    const representativePet =
      await this.petRepository.findRepresentativeByUserId(userId);
    if (!representativePet) {
      return { data: [], hasNext: false, cursor: null };
    }

    return this.postRepository.getMissionHistory(
      representativePet.id,
      query.cursor ?? undefined,
      query.limit,
    );
  }
}
