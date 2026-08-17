import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportRepository } from './report.repository';

describe('ReportService', () => {
  let service: ReportService;
  let repository: jest.Mocked<ReportRepository>;

  beforeEach(async () => {
    const mockRepository = {
      createReport: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: ReportRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    repository = module.get<jest.Mocked<ReportRepository>>(ReportRepository);
  });

  describe('createReport', () => {
    it('정상 신고 생성', async () => {
      repository.createReport.mockResolvedValue(undefined);

      await expect(
        service.createReport(1, 10, { reason: 'spam' }),
      ).resolves.toBeUndefined();

      expect(repository.createReport).toHaveBeenCalledWith(10, 1, 'spam');
    });

    it('게시물이 없으면(FK 위반) NotFoundException', async () => {
      const dbError = new Error('foreign key violation');
      dbError.cause = { code: '23503' };
      repository.createReport.mockRejectedValue(dbError);

      await expect(
        service.createReport(1, 999, { reason: 'spam' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('중복 신고 - ConflictException', async () => {
      const dbError = new Error('duplicate key');
      dbError.cause = { code: '23505' };
      repository.createReport.mockRejectedValue(dbError);

      await expect(
        service.createReport(1, 10, { reason: 'spam' }),
      ).rejects.toThrow(ConflictException);

      expect(repository.createReport).toHaveBeenCalledWith(10, 1, 'spam');
    });

    it('기타 데이터베이스 에러는 그대로 throw', async () => {
      const dbError = new Error('database error');
      repository.createReport.mockRejectedValue(dbError);

      await expect(
        service.createReport(1, 10, { reason: 'spam' }),
      ).rejects.toThrow(Error);

      expect(repository.createReport).toHaveBeenCalledWith(10, 1, 'spam');
    });
  });
});
