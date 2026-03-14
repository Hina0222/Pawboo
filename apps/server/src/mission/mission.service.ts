import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { eq, and, lt, desc } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../database/database.provider';
import type { DrizzleDB } from '../database/database.provider';
import { missions, missionSubmissions, pets } from '../database/schema';
import { AwsService, IMAGE_PRESET } from '../aws/aws.service';
import type {
  CreateSubmissionRequest,
  SubmissionHistoryQuery,
  MissionResponse,
  SubmissionResponse,
  SubmissionHistoryResponse,
  TodayMissionResponse,
} from '@bragram/schemas/mission';

@Injectable()
export class MissionService {
  constructor(
    @Inject(DRIZZLE_ORM) private readonly db: DrizzleDB,
    private readonly awsService: AwsService,
  ) {}

  private getKstToday(): string {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul',
    }).format(new Date());
  }

  private async getActivePet(userId: number) {
    const [pet] = await this.db
      .select()
      .from(pets)
      .where(and(eq(pets.userId, userId), eq(pets.isActive, true)));
    return pet ?? null;
  }

  async findToday(userId: number): Promise<TodayMissionResponse> {
    const today = this.getKstToday();

    const [mission] = await this.db
      .select()
      .from(missions)
      .where(eq(missions.scheduledAt, today));

    if (!mission) {
      return { mission: null, submission: null };
    }

    const activePet = await this.getActivePet(userId);

    if (!activePet) {
      return { mission: mission as MissionResponse, submission: null };
    }

    const [submission] = await this.db
      .select()
      .from(missionSubmissions)
      .where(
        and(
          eq(missionSubmissions.missionId, mission.id),
          eq(missionSubmissions.petId, activePet.id),
        ),
      );

    return {
      mission: mission as MissionResponse,
      submission: (submission as SubmissionResponse) ?? null,
    };
  }

  async submitMission(
    userId: number,
    missionId: number,
    imageBuffer: Buffer,
    body: CreateSubmissionRequest,
  ): Promise<SubmissionResponse> {
    const activePet = await this.getActivePet(userId);
    if (!activePet) {
      throw new BadRequestException('활성 펫이 없습니다.');
    }

    const [mission] = await this.db
      .select()
      .from(missions)
      .where(eq(missions.id, missionId));
    if (!mission) {
      throw new NotFoundException('미션을 찾을 수 없습니다.');
    }

    const imageUrl = await this.awsService.uploadImage(
      imageBuffer,
      IMAGE_PRESET.MISSION,
    );

    try {
      const [submission] = await this.db.transaction(async (tx) => {
        const [inserted] = await tx
          .insert(missionSubmissions)
          .values({
            missionId,
            petId: activePet.id,
            imageUrl,
            comment: body.comment ?? null,
            hashtags: body.hashtags ?? null,
          })
          .returning();

        await tx
          .update(pets)
          .set({
            score: activePet.score + mission.baseScore,
            weeklyScore: activePet.weeklyScore + mission.baseScore,
            monthlyScore: activePet.monthlyScore + mission.baseScore,
            updatedAt: new Date(),
          })
          .where(eq(pets.id, activePet.id));

        return [inserted];
      });

      return submission as SubmissionResponse;
    } catch (err: unknown) {
      const pgErr = err as { cause?: { code?: string } };
      if (pgErr?.cause?.code === '23505') {
        await this.awsService.deleteImage(imageUrl);
        throw new ConflictException('이미 제출된 미션입니다.');
      }
      await this.awsService.deleteImage(imageUrl);
      throw err;
    }
  }

  async deleteSubmission(
    userId: number,
    missionId: number,
    submissionId: number,
  ): Promise<void> {
    const [submission] = await this.db
      .select({
        id: missionSubmissions.id,
        petId: missionSubmissions.petId,
        imageUrl: missionSubmissions.imageUrl,
        baseScore: missions.baseScore,
      })
      .from(missionSubmissions)
      .innerJoin(missions, eq(missionSubmissions.missionId, missions.id))
      .where(
        and(
          eq(missionSubmissions.id, submissionId),
          eq(missionSubmissions.missionId, missionId),
        ),
      );

    if (!submission) {
      throw new NotFoundException('제출 내역을 찾을 수 없습니다.');
    }

    const [pet] = await this.db
      .select()
      .from(pets)
      .where(and(eq(pets.id, submission.petId), eq(pets.userId, userId)));

    if (!pet) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    await this.db.transaction(async (tx) => {
      await tx
        .delete(missionSubmissions)
        .where(eq(missionSubmissions.id, submissionId));

      await tx
        .update(pets)
        .set({
          score: Math.max(0, pet.score - submission.baseScore),
          weeklyScore: Math.max(0, pet.weeklyScore - submission.baseScore),
          monthlyScore: Math.max(0, pet.monthlyScore - submission.baseScore),
          updatedAt: new Date(),
        })
        .where(eq(pets.id, pet.id));
    });

    await this.awsService.deleteImage(submission.imageUrl);
  }

  async findHistory(
    userId: number,
    query: SubmissionHistoryQuery,
  ): Promise<SubmissionHistoryResponse> {
    const activePet = await this.getActivePet(userId);
    if (!activePet) {
      return { data: [], hasNext: false, cursor: null };
    }

    const conditions = [eq(missionSubmissions.petId, activePet.id)];
    if (query.cursor) {
      conditions.push(lt(missionSubmissions.id, query.cursor));
    }

    const rows = await this.db
      .select()
      .from(missionSubmissions)
      .where(and(...conditions))
      .orderBy(desc(missionSubmissions.createdAt))
      .limit(query.limit + 1);

    const hasNext = rows.length > query.limit;
    const data = hasNext ? rows.slice(0, query.limit) : rows;

    return {
      data: data as SubmissionResponse[],
      hasNext,
      cursor: hasNext ? data[data.length - 1].id : null,
    };
  }
}
