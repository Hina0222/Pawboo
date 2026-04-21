import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { MissionRepository } from './mission.repository';
import { PostService } from '../post/post.service';
import type { PostResponse } from '@pawboo/schemas/post';
import type { TodayMissionResponse } from '@pawboo/schemas/mission';

@Injectable()
export class MissionService {
  constructor(
    private readonly missionRepository: MissionRepository,
    private readonly postService: PostService,
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

    const post = await this.postService.findMissionSubmission(
      userId,
      mission.id,
    );

    return { mission, post };
  }

  async submitMission(
    userId: number,
    missionId: number,
    imageBuffers: Buffer[],
  ): Promise<PostResponse> {
    const mission = await this.missionRepository.findById(missionId);
    if (!mission) {
      throw new NotFoundException('미션을 찾을 수 없습니다.');
    }

    try {
      return await this.postService.createPost(userId, imageBuffers, missionId);
    } catch (err: unknown) {
      const pgErr = err as { cause?: { code?: string } };
      if (pgErr?.cause?.code === '23505') {
        throw new ConflictException('이미 제출된 미션입니다.');
      }
      throw err;
    }
  }
}
