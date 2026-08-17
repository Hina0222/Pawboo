import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeRepository } from './like.repository';

describe('LikeService', () => {
  let service: LikeService;
  let repository: jest.Mocked<LikeRepository>;

  beforeEach(async () => {
    const mockRepository = {
      addLike: jest.fn(),
      removeLike: jest.fn(),
      countByPostId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeService,
        {
          provide: LikeRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LikeService>(LikeService);
    repository = module.get<jest.Mocked<LikeRepository>>(LikeRepository);
  });

  describe('addLike', () => {
    it('정상 좋아요 추가', async () => {
      repository.addLike.mockResolvedValue(undefined);
      repository.countByPostId.mockResolvedValue(5);

      const result = await service.addLike(42, 99);

      expect(result).toEqual({ likeCount: 5, isLiked: true });
      expect(repository.addLike).toHaveBeenCalledWith(99, 42);
      expect(repository.countByPostId).toHaveBeenCalledWith(99);
    });

    it('없는 게시물에 좋아요(FK 위반) - NotFoundException', async () => {
      const dbError = new Error('foreign key violation');
      dbError.cause = { code: '23503' };
      repository.addLike.mockRejectedValue(dbError);

      await expect(service.addLike(1, 999)).rejects.toThrow(NotFoundException);
      expect(repository.countByPostId).not.toHaveBeenCalled();
    });

    it('중복 좋아요 - ConflictException', async () => {
      const dbError = new Error('duplicate key');
      dbError.cause = { code: '23505' };
      repository.addLike.mockRejectedValue(dbError);

      await expect(service.addLike(42, 99)).rejects.toThrow(ConflictException);
      expect(repository.addLike).toHaveBeenCalledWith(99, 42);
      expect(repository.countByPostId).not.toHaveBeenCalled();
    });

    it('기타 데이터베이스 에러는 그대로 throw', async () => {
      const dbError = new Error('database error');
      repository.addLike.mockRejectedValue(dbError);

      await expect(service.addLike(42, 99)).rejects.toThrow(Error);
      expect(repository.addLike).toHaveBeenCalledWith(99, 42);
      expect(repository.countByPostId).not.toHaveBeenCalled();
    });
  });

  describe('removeLike', () => {
    it('정상 좋아요 제거', async () => {
      repository.removeLike.mockResolvedValue(1);
      repository.countByPostId.mockResolvedValue(3);

      const result = await service.removeLike(42, 99);

      expect(result).toEqual({ likeCount: 3, isLiked: false });
      expect(repository.removeLike).toHaveBeenCalledWith(99, 42);
      expect(repository.countByPostId).toHaveBeenCalledWith(99);
    });

    it('존재하지 않는 좋아요 제거 - NotFoundException', async () => {
      repository.removeLike.mockResolvedValue(0);

      await expect(service.removeLike(1, 999)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.removeLike).toHaveBeenCalledWith(999, 1);
      expect(repository.countByPostId).not.toHaveBeenCalled();
    });

    it('좋아요 제거 후 0개까지 감소', async () => {
      repository.removeLike.mockResolvedValue(1);
      repository.countByPostId.mockResolvedValue(0);

      const result = await service.removeLike(42, 99);

      expect(result).toEqual({ likeCount: 0, isLiked: false });
      expect(repository.removeLike).toHaveBeenCalledWith(99, 42);
    });
  });
});
