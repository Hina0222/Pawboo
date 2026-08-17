import { createHash } from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

interface User {
  id: number;
  kakaoId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async login(user: User) {
    const tokens = await this.generateTokens(user.id, user.kakaoId);
    await this.userService.updateRefreshToken(
      user.id,
      this.hashToken(tokens.refreshToken),
    );
    return tokens;
  }

  async refreshTokens(refreshToken: string) {
    let payload: { sub: number; kakaoId: string };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findById(payload.sub);
    if (!user?.refreshToken) throw new UnauthorizedException();

    if (this.hashToken(refreshToken) !== user.refreshToken) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateTokens(user.id, user.kakaoId);
    await this.userService.updateRefreshToken(
      user.id,
      this.hashToken(tokens.refreshToken),
    );
    return tokens;
  }

  async logoutByRefreshToken(refreshToken: string) {
    let payload: { sub: number; kakaoId: string };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      return;
    }

    const user = await this.userService.findById(payload.sub);
    if (!user?.refreshToken) return;

    if (this.hashToken(refreshToken) !== user.refreshToken) return;

    await this.userService.updateRefreshToken(user.id, null);
  }

  async withdrawUser(userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // Kakao unlink (실패해도 탈퇴 진행)
    try {
      const adminKey = this.configService.get<string>('KAKAO_ADMIN_KEY');
      await fetch('https://kapi.kakao.com/v1/user/unlink', {
        method: 'POST',
        headers: {
          Authorization: `KakaoAK ${adminKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `target_id_type=user_id&target_id=${user.kakaoId}`,
      });
    } catch (e) {
      console.error('Kakao unlink failed:', e);
    }

    await this.userService.deleteMe(userId);
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async generateTokens(userId: number, kakaoId: string) {
    const payload = { sub: userId, kakaoId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '30d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
