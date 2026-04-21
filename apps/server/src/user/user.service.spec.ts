import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

  const mockUser = {
    id: 1,
    kakaoId: 'kakao_123',
    refreshToken: null,
    createdAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const mockRepository = {
      findByKakaoId: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateRefreshToken: jest.fn(),
      deleteById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(UserService);
    repository = module.get(UserRepository);
  });

  describe('findOrCreate', () => {
    it('기존 유저가 있으면 새로 만들지 않고 반환', async () => {
      repository.findByKakaoId.mockResolvedValue(mockUser);

      const result = await service.findOrCreate({ kakaoId: 'kakao_123' });

      expect(result).toEqual(mockUser);
      expect(repository.findByKakaoId).toHaveBeenCalledWith('kakao_123');
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('기존 유저가 없으면 새 유저 생성', async () => {
      const newUser = { ...mockUser, id: 2 };
      repository.findByKakaoId.mockResolvedValue(null);
      repository.create.mockResolvedValue(newUser);

      const result = await service.findOrCreate({ kakaoId: 'kakao_456' });

      expect(result).toEqual(newUser);
      expect(repository.findByKakaoId).toHaveBeenCalledWith('kakao_456');
      expect(repository.create).toHaveBeenCalledWith('kakao_456');
    });
  });

  describe('getMe', () => {
    it('유저가 존재하면 MeResponse 반환', async () => {
      repository.findById.mockResolvedValue(mockUser);

      const result = await service.getMe(1);

      expect(result).toEqual({
        id: mockUser.id,
        kakaoId: mockUser.kakaoId,
        createdAt: mockUser.createdAt,
      });
      expect(repository.findById).toHaveBeenCalledWith(1);
    });

    it('유저가 없으면 NotFoundException 던짐', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getMe(999)).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith(999);
    });

    it('응답에 refreshToken이 노출되지 않음', async () => {
      repository.findById.mockResolvedValue({
        ...mockUser,
        refreshToken: 'SECRET_TOKEN',
      });

      const result = await service.getMe(1);

      expect(result).not.toHaveProperty('refreshToken');
      expect(Object.keys(result)).toEqual(['id', 'kakaoId', 'createdAt']);
    });
  });

  describe('deleteMe', () => {
    it('유저가 존재하면 삭제 실행', async () => {
      repository.findById.mockResolvedValue(mockUser);
      repository.deleteById.mockResolvedValue(undefined);

      await service.deleteMe(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.deleteById).toHaveBeenCalledWith(1);
    });

    it('유저가 없으면 NotFoundException 던짐', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.deleteMe(999)).rejects.toThrow(NotFoundException);
      expect(repository.deleteById).not.toHaveBeenCalled();
    });
  });
});
