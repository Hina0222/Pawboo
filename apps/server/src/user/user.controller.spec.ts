import { Test, TestingModule } from '@nestjs/testing';
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

  beforeEach(async () => {
    const mockService = {
      getMe: jest.fn(),
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
});
