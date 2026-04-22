import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionRepository } from './mission.repository';
import { PostService } from '../post/post.service';
import type { PostResponse } from '@pawboo/schemas/post';
import type { MissionRecord } from '../database/schema';

jest.mock('../aws/aws.service', () => ({
  AwsService: jest.fn(),
  IMAGE_PRESET: { POST: 'post' },
}));

const mockMission: MissionRecord = {
  id: 1,
  title: '오늘의 산책 미션',
  description: '반려동물과 30분 산책하기',
  exampleImageUrl: null,
  scheduledAt: '2026-04-22',
  createdAt: new Date('2026-04-22T00:00:00.000Z'),
};

const mockPostResponse: PostResponse = {
  id: 10,
  petId: 5,
  type: 'mission',
  missionId: 1,
  imageUrls: ['https://example.com/img.jpg'],
  createdAt: new Date('2026-04-22T10:00:00.000Z'),
};

describe('MissionService', () => {
  let service: MissionService;
  let missionRepository: jest.Mocked<MissionRepository>;
  let postService: jest.Mocked<PostService>;

  const mockMissionRepository = {
    findByDate: jest.fn(),
    findById: jest.fn(),
  };

  const mockPostService = {
    findMissionSubmission: jest.fn(),
    createPost: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MissionService,
        { provide: MissionRepository, useValue: mockMissionRepository },
        { provide: PostService, useValue: mockPostService },
      ],
    }).compile();

    service = module.get<MissionService>(MissionService);
    missionRepository =
      module.get<jest.Mocked<MissionRepository>>(MissionRepository);
    postService = module.get<jest.Mocked<PostService>>(PostService);

    jest.clearAllMocks();
  });

  describe('findToday', () => {
    it('미션 없으면 { mission: null, post: null } 반환', async () => {
      missionRepository.findByDate.mockResolvedValue(null);

      const result = await service.findToday(1);

      expect(result).toEqual({ mission: null, post: null });
      expect(postService.findMissionSubmission).not.toHaveBeenCalled();
    });

    it('미션과 포스트 모두 있을 때 정상 반환', async () => {
      missionRepository.findByDate.mockResolvedValue(mockMission);
      postService.findMissionSubmission.mockResolvedValue(mockPostResponse);

      const result = await service.findToday(1);

      expect(result).toEqual({ mission: mockMission, post: mockPostResponse });
      expect(postService.findMissionSubmission).toHaveBeenCalledWith(
        1,
        mockMission.id,
      );
    });

    it('미션은 있고 포스트 없을 때 post: null 반환', async () => {
      missionRepository.findByDate.mockResolvedValue(mockMission);
      postService.findMissionSubmission.mockResolvedValue(null);

      const result = await service.findToday(1);

      expect(result).toEqual({ mission: mockMission, post: null });
    });

    it('findByDate 호출 시 YYYY-MM-DD 형식의 날짜 전달', async () => {
      missionRepository.findByDate.mockResolvedValue(null);

      await service.findToday(1);

      const dateArg = missionRepository.findByDate.mock.calls[0][0];
      expect(dateArg).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('submitMission', () => {
    it('미션 없음 - NotFoundException', async () => {
      missionRepository.findById.mockResolvedValue(null);

      await expect(
        service.submitMission(1, 999, [Buffer.from('img')]),
      ).rejects.toThrow(NotFoundException);
      expect(postService.createPost).not.toHaveBeenCalled();
    });

    it('정상 미션 제출', async () => {
      missionRepository.findById.mockResolvedValue(mockMission);
      postService.createPost.mockResolvedValue(mockPostResponse);

      const result = await service.submitMission(1, 1, [Buffer.from('img')]);

      expect(missionRepository.findById).toHaveBeenCalledWith(1);
      expect(postService.createPost).toHaveBeenCalledWith(
        1,
        [Buffer.from('img')],
        1,
      );
      expect(result).toEqual(mockPostResponse);
    });

    it('중복 제출 (PG 23505) - ConflictException', async () => {
      missionRepository.findById.mockResolvedValue(mockMission);
      const pgError = Object.assign(new Error('unique violation'), {
        cause: { code: '23505' },
      });
      postService.createPost.mockRejectedValue(pgError);

      await expect(
        service.submitMission(1, 1, [Buffer.from('img')]),
      ).rejects.toThrow(ConflictException);
    });

    it('기타 DB 에러는 그대로 re-throw', async () => {
      missionRepository.findById.mockResolvedValue(mockMission);
      const genericError = new Error('db connection lost');
      postService.createPost.mockRejectedValue(genericError);

      await expect(
        service.submitMission(1, 1, [Buffer.from('img')]),
      ).rejects.toThrow('db connection lost');
    });

    it('PG 23505 외의 cause 코드는 ConflictException으로 변환하지 않음', async () => {
      missionRepository.findById.mockResolvedValue(mockMission);
      const fkError = Object.assign(new Error('fk violation'), {
        cause: { code: '23503' },
      });
      postService.createPost.mockRejectedValue(fkError);

      await expect(
        service.submitMission(1, 1, [Buffer.from('img')]),
      ).rejects.toThrow('fk violation');
      await expect(
        service.submitMission(1, 1, [Buffer.from('img')]),
      ).rejects.not.toBeInstanceOf(ConflictException);
    });
  });
});
