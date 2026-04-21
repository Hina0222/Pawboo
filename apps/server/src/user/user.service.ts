import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import type { MeResponse } from '@pawboo/schemas/user';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: number) {
    return this.userRepository.findById(id);
  }

  async findOrCreate(profile: { kakaoId: string }) {
    const existing = await this.userRepository.findByKakaoId(profile.kakaoId);
    if (existing) return existing;
    return this.userRepository.create(profile.kakaoId);
  }

  async updateRefreshToken(id: number, refreshToken: string | null) {
    return this.userRepository.updateRefreshToken(id, refreshToken);
  }

  async getMe(userId: number): Promise<MeResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    return { id: user.id, kakaoId: user.kakaoId, createdAt: user.createdAt };
  }

  async deleteMe(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    await this.userRepository.deleteById(userId);
  }
}
