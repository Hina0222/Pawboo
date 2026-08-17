import { createHash } from 'crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

const sha256 = (token: string) =>
  createHash('sha256').update(token).digest('hex');

type UserRecord = NonNullable<Awaited<ReturnType<UserService['findById']>>>;

const mockUser: UserRecord = {
  id: 1,
  kakaoId: '12345',
  refreshToken: 'hashed_token',
  createdAt: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: jest.Mocked<JwtService>;
  let userService: jest.Mocked<UserService>;

  const mockJwtService = {
    signAsync: jest.fn(),
    verify: jest.fn(),
  };

  const mockUserService = {
    findById: jest.fn(),
    updateRefreshToken: jest.fn(),
    deleteMe: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const values: Record<string, string> = {
        JWT_SECRET: 'access-secret',
        JWT_REFRESH_SECRET: 'refresh-secret',
        KAKAO_ADMIN_KEY: 'admin-key',
      };
      return values[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UserService, useValue: mockUserService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<jest.Mocked<JwtService>>(JwtService);
    userService = module.get<jest.Mocked<UserService>>(UserService);

    jest.clearAllMocks();
    (global.fetch as jest.Mock) = jest.fn();
  });

  describe('login', () => {
    it('토큰 발급 후 refreshToken을 해싱하여 저장', async () => {
      jwtService.signAsync
        .mockResolvedValueOnce('access_token')
        .mockResolvedValueOnce('refresh_token');
      userService.updateRefreshToken.mockResolvedValue(undefined);

      const result = await service.login({ id: 1, kakaoId: '12345' });

      expect(result).toEqual({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(
        1,
        { sub: 1, kakaoId: '12345' },
        { secret: 'access-secret', expiresIn: '1h' },
      );
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(
        2,
        { sub: 1, kakaoId: '12345' },
        { secret: 'refresh-secret', expiresIn: '30d' },
      );
      expect(userService.updateRefreshToken).toHaveBeenCalledWith(
        1,
        sha256('refresh_token'),
      );
    });
  });

  describe('refreshTokens', () => {
    it('정상 갱신 - 새 토큰 쌍 반환 및 refreshToken 저장', async () => {
      jwtService.verify.mockReturnValue({ sub: 1, kakaoId: '12345' });
      userService.findById.mockResolvedValue({
        ...mockUser,
        refreshToken: sha256('valid_refresh_token'),
      });
      jwtService.signAsync
        .mockResolvedValueOnce('new_access')
        .mockResolvedValueOnce('new_refresh');
      userService.updateRefreshToken.mockResolvedValue(undefined);

      const result = await service.refreshTokens('valid_refresh_token');

      expect(result).toEqual({
        accessToken: 'new_access',
        refreshToken: 'new_refresh',
      });
      expect(jwtService.verify).toHaveBeenCalledWith('valid_refresh_token', {
        secret: 'refresh-secret',
      });
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(
        1,
        { sub: 1, kakaoId: '12345' },
        { secret: 'access-secret', expiresIn: '1h' },
      );
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(
        2,
        { sub: 1, kakaoId: '12345' },
        { secret: 'refresh-secret', expiresIn: '30d' },
      );
      expect(userService.updateRefreshToken).toHaveBeenCalledWith(
        1,
        sha256('new_refresh'),
      );
    });

    it('JWT 검증 실패 - UnauthorizedException', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('invalid token');
      });

      await expect(service.refreshTokens('bad_token')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userService.findById).not.toHaveBeenCalled();
    });

    it('유저 없음 - UnauthorizedException', async () => {
      jwtService.verify.mockReturnValue({ sub: 1, kakaoId: '12345' });
      userService.findById.mockResolvedValue(null);

      await expect(service.refreshTokens('valid_token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('저장된 refreshToken 없음 (로그아웃 상태) - UnauthorizedException', async () => {
      jwtService.verify.mockReturnValue({ sub: 1, kakaoId: '12345' });
      userService.findById.mockResolvedValue({
        ...mockUser,
        refreshToken: null,
      });

      await expect(service.refreshTokens('valid_token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('refreshToken 불일치 - UnauthorizedException', async () => {
      jwtService.verify.mockReturnValue({ sub: 1, kakaoId: '12345' });
      userService.findById.mockResolvedValue(mockUser);

      await expect(service.refreshTokens('wrong_token')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userService.updateRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe('logoutByRefreshToken', () => {
    it('정상 로그아웃 - updateRefreshToken(null) 호출', async () => {
      jwtService.verify.mockReturnValue({ sub: 1, kakaoId: '12345' });
      userService.findById.mockResolvedValue({
        ...mockUser,
        refreshToken: sha256('valid_token'),
      });
      userService.updateRefreshToken.mockResolvedValue(undefined);

      await service.logoutByRefreshToken('valid_token');

      expect(userService.updateRefreshToken).toHaveBeenCalledWith(1, null);
    });

    it('JWT 검증 실패 - 에러 없이 반환', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('invalid');
      });

      await expect(
        service.logoutByRefreshToken('bad_token'),
      ).resolves.toBeUndefined();
      expect(userService.findById).not.toHaveBeenCalled();
    });

    it('유저 없음 - 에러 없이 반환', async () => {
      jwtService.verify.mockReturnValue({ sub: 1, kakaoId: '12345' });
      userService.findById.mockResolvedValue(null);

      await expect(
        service.logoutByRefreshToken('valid_token'),
      ).resolves.toBeUndefined();
      expect(userService.updateRefreshToken).not.toHaveBeenCalled();
    });

    it('refreshToken 불일치 - 에러 없이 반환', async () => {
      jwtService.verify.mockReturnValue({ sub: 1, kakaoId: '12345' });
      userService.findById.mockResolvedValue(mockUser);

      await expect(
        service.logoutByRefreshToken('wrong_token'),
      ).resolves.toBeUndefined();
      expect(userService.updateRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe('withdrawUser', () => {
    it('정상 탈퇴 - deleteMe 호출 및 카카오 unlink API 호출', async () => {
      userService.findById.mockResolvedValue(mockUser);
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
      userService.deleteMe.mockResolvedValue(undefined);

      await service.withdrawUser(1);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://kapi.kakao.com/v1/user/unlink',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'KakaoAK admin-key',
            'Content-Type': 'application/x-www-form-urlencoded',
          }) as jest.AsymmetricMatcher,
          body: `target_id_type=user_id&target_id=${mockUser.kakaoId}`,
        }),
      );
      expect(userService.deleteMe).toHaveBeenCalledWith(1);
    });

    it('유저 없음 - Error throw', async () => {
      userService.findById.mockResolvedValue(null);

      await expect(service.withdrawUser(999)).rejects.toThrow(
        '사용자를 찾을 수 없습니다.',
      );
      expect(userService.deleteMe).not.toHaveBeenCalled();
    });

    it('카카오 unlink 실패해도 deleteMe 실행', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      userService.findById.mockResolvedValue(mockUser);
      (global.fetch as jest.Mock).mockRejectedValue(new Error('network error'));
      userService.deleteMe.mockResolvedValue(undefined);

      try {
        await service.withdrawUser(1);

        expect(userService.deleteMe).toHaveBeenCalledWith(1);
        expect(consoleErrorSpy).toHaveBeenCalled();
      } finally {
        consoleErrorSpy.mockRestore();
      }
    });
  });
});
