import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.type';

describe('ReportController', () => {
  let controller: ReportController;
  let service: jest.Mocked<ReportService>;

  beforeEach(async () => {
    const mockService = {
      createReport: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        {
          provide: ReportService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ReportController>(ReportController);
    service = module.get<jest.Mocked<ReportService>>(ReportService);
  });

  describe('POST /posts/:postId/report', () => {
    it('정상 신고 생성', async () => {
      service.createReport.mockResolvedValue(undefined);

      const req = { user: { id: 1 } } as AuthenticatedRequest;

      const result = await controller.createReport(req, 10, {
        reason: 'spam',
      });

      expect(result).toBeUndefined();
      expect(service.createReport).toHaveBeenCalledWith(1, 10, {
        reason: 'spam',
      });
    });

    it('userId와 postId 정상 전달', async () => {
      service.createReport.mockResolvedValue(undefined);

      const req = { user: { id: 42 } } as AuthenticatedRequest;

      await controller.createReport(req, 99, { reason: 'inappropriate' });

      expect(service.createReport).toHaveBeenCalledWith(42, 99, {
        reason: 'inappropriate',
      });
    });

    it('reason이 없으면 BadRequestException', async () => {
      const req = { user: { id: 1 } } as AuthenticatedRequest;

      await expect(controller.createReport(req, 10, {})).rejects.toThrow(
        BadRequestException,
      );

      expect(service.createReport).not.toHaveBeenCalled();
    });

    it('유효하지 않은 reason 값이면 BadRequestException', async () => {
      const req = { user: { id: 1 } } as AuthenticatedRequest;

      await expect(
        controller.createReport(req, 10, { reason: 'invalid_reason' }),
      ).rejects.toThrow(BadRequestException);

      expect(service.createReport).not.toHaveBeenCalled();
    });

    it('reason이 number면 BadRequestException', async () => {
      const req = { user: { id: 1 } } as AuthenticatedRequest;

      await expect(
        controller.createReport(req, 10, { reason: 123 }),
      ).rejects.toThrow(BadRequestException);

      expect(service.createReport).not.toHaveBeenCalled();
    });

    it('reason이 null이면 BadRequestException', async () => {
      const req = { user: { id: 1 } } as AuthenticatedRequest;

      await expect(
        controller.createReport(req, 10, { reason: null }),
      ).rejects.toThrow(BadRequestException);

      expect(service.createReport).not.toHaveBeenCalled();
    });

    it('body가 null이면 BadRequestException', async () => {
      const req = { user: { id: 1 } } as AuthenticatedRequest;

      await expect(controller.createReport(req, 10, null)).rejects.toThrow(
        BadRequestException,
      );

      expect(service.createReport).not.toHaveBeenCalled();
    });

    it('body가 배열이면 BadRequestException', async () => {
      const req = { user: { id: 1 } } as AuthenticatedRequest;

      await expect(controller.createReport(req, 10, [])).rejects.toThrow(
        BadRequestException,
      );

      expect(service.createReport).not.toHaveBeenCalled();
    });
  });
});
