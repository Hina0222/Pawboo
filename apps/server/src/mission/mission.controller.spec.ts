import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.type';
import type { PostResponse } from '@pawboo/schemas/post';
import type { TodayMissionResponse } from '@pawboo/schemas/mission';
import type { MissionRecord } from '../database/schema';

jest.mock('../aws/aws.service', () => ({
  AwsService: jest.fn(),
  IMAGE_PRESET: { POST: 'post' },
}));

const req = { user: { id: 1 } } as AuthenticatedRequest;

const mockMission: MissionRecord = {
  id: 1,
  title: '오늘의 산책 미션',
  description: '반려동물과 30분 산책하기',
  exampleImageUrl: null,
  scheduledAt: '2026-04-22',
  createdAt: new Date(),
};

const mockPostResponse: PostResponse = {
  id: 10,
  petId: 5,
  type: 'mission',
  missionId: 1,
  imageUrls: ['https://example.com/img.jpg'],
  createdAt: new Date(),
};

describe('MissionController', () => {
  let controller: MissionController;
  let service: jest.Mocked<MissionService>;

  const mockMissionService = {
    findToday: jest.fn(),
    submitMission: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MissionController],
      providers: [{ provide: MissionService, useValue: mockMissionService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MissionController>(MissionController);
    service = module.get<jest.Mocked<MissionService>>(MissionService);

    jest.clearAllMocks();
  });

  describe('findToday', () => {
    it('미션 제출한 경우 submitted: true 반환', async () => {
      const mockResponse: TodayMissionResponse = {
        mission: mockMission,
        submitted: true,
      };
      service.findToday.mockResolvedValue(mockResponse);

      const result = await controller.findToday(req);

      expect(service.findToday).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResponse);
    });

    it('미션이 없을 때 submitted: false 반환', async () => {
      const mockResponse: TodayMissionResponse = {
        mission: null,
        submitted: false,
      };
      service.findToday.mockResolvedValue(mockResponse);

      const result = await controller.findToday(req);

      expect(service.findToday).toHaveBeenCalledWith(1);
      expect(result).toEqual({ mission: null, submitted: false });
    });

    it('서비스 에러 전파', async () => {
      service.findToday.mockRejectedValue(new Error('db error'));

      await expect(controller.findToday(req)).rejects.toThrow('db error');
    });
  });

  describe('submit', () => {
    it('이미지 버퍼 추출 후 서비스 호출', async () => {
      service.submitMission.mockResolvedValue(mockPostResponse);
      const files = [
        { buffer: Buffer.from('img1') },
        { buffer: Buffer.from('img2') },
      ] as Express.Multer.File[];

      const result = await controller.submit(req, 1, files);

      expect(service.submitMission).toHaveBeenCalledWith(1, 1, [
        files[0].buffer,
        files[1].buffer,
      ]);
      expect(result).toEqual(mockPostResponse);
    });

    it('미션 없음 - NotFoundException 전파', async () => {
      service.submitMission.mockRejectedValue(
        new NotFoundException('미션을 찾을 수 없습니다.'),
      );
      const files = [{ buffer: Buffer.from('img') }] as Express.Multer.File[];

      await expect(controller.submit(req, 999, files)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('중복 제출 - ConflictException 전파', async () => {
      service.submitMission.mockRejectedValue(
        new ConflictException('이미 제출된 미션입니다.'),
      );
      const files = [{ buffer: Buffer.from('img') }] as Express.Multer.File[];

      await expect(controller.submit(req, 1, files)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
