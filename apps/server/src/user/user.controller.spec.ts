import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.type';

describe('UserController', () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;

  const mockUser = {
    id: 1,
    kakaoId: 'kakao_123',
    createdAt: new Date('2024-01-01'),
  };

  const mockPetSearchResult = {
    data: [
      { id: 1, name: '포비', imageUrl: 'url1' },
      { id: 2, name: '뽀삐', imageUrl: null },
    ],
    hasNext: false,
    cursor: null,
  };

  beforeEach(async () => {
    const mockService = {
      getMe: jest.fn(),
      searchPets: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(UserController);
    service = module.get(UserService);
  });

  describe('GET /users/me', () => {
    it('내 정보 조회 성공', async () => {
      service.getMe.mockResolvedValue(mockUser);

      const req = { user: { id: 1 } } as unknown as AuthenticatedRequest;
      const result = await controller.getMe(req);

      expect(result).toEqual(mockUser);
      expect(service.getMe).toHaveBeenCalledWith(1);
    });

    it('사용자를 찾을 수 없으면 에러', async () => {
      service.getMe.mockRejectedValue(new Error('사용자를 찾을 수 없습니다.'));

      const req = { user: { id: 999 } } as unknown as AuthenticatedRequest;

      await expect(controller.getMe(req)).rejects.toThrow();
    });
  });

  describe('GET /users/search', () => {
    it('유효한 쿼리로 펫 검색', async () => {
      service.searchPets.mockResolvedValue(mockPetSearchResult);

      const result = await controller.searchPets({ q: '포비' });

      expect(result).toEqual(mockPetSearchResult);
      expect(service.searchPets).toHaveBeenCalledWith({
        q: '포비',
        cursor: undefined,
        limit: 20,
      });
    });

    it('쿼리 파라미터 - cursor와 limit 지정', async () => {
      service.searchPets.mockResolvedValue(mockPetSearchResult);

      await controller.searchPets({
        q: '포',
        cursor: '5',
        limit: '10',
      });

      expect(service.searchPets).toHaveBeenCalledWith({
        q: '포',
        cursor: 5,
        limit: 10,
      });
    });

    it('빈 쿼리 (q가 없음) - BadRequestException', () => {
      const req = { q: '' };

      expect(() => {
        controller.searchPets(req);
      }).toThrow(BadRequestException);
    });

    it('limit이 범위를 초과하면 BadRequestException', () => {
      expect(() => {
        controller.searchPets({
          q: '포',
          limit: '50',
        });
      }).toThrow(BadRequestException);
    });

    it('limit이 1 미만이면 BadRequestException', () => {
      expect(() => {
        controller.searchPets({
          q: '포',
          limit: '0',
        });
      }).toThrow(BadRequestException);
    });

    it('cursor가 양수가 아니면 BadRequestException', () => {
      expect(() => {
        controller.searchPets({
          q: '포',
          cursor: '-1',
        });
      }).toThrow(BadRequestException);
    });

    it('limit 생략 시 기본값 20 적용', async () => {
      service.searchPets.mockResolvedValue(mockPetSearchResult);

      await controller.searchPets({ q: '포' });

      expect(service.searchPets).toHaveBeenCalledWith({
        q: '포',
        cursor: undefined,
        limit: 20,
      });
    });

    it('limit=1 (최소값) 허용', async () => {
      service.searchPets.mockResolvedValue(mockPetSearchResult);

      await controller.searchPets({ q: '포', limit: '1' });

      expect(service.searchPets).toHaveBeenCalledWith({
        q: '포',
        cursor: undefined,
        limit: 1,
      });
    });

    it('limit=30 (최대값) 허용', async () => {
      service.searchPets.mockResolvedValue(mockPetSearchResult);

      await controller.searchPets({ q: '포', limit: '30' });

      expect(service.searchPets).toHaveBeenCalledWith({
        q: '포',
        cursor: undefined,
        limit: 30,
      });
    });
  });
});
