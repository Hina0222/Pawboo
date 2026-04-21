import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { LikeRepository } from './like.repository';
import type { LikeResponse } from '@pawboo/schemas/like';

@Injectable()
export class LikeService {
  constructor(private readonly likeRepository: LikeRepository) {}

  async addLike(userId: number, postId: number): Promise<LikeResponse> {
    const exists = await this.likeRepository.existsPost(postId);
    if (!exists) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }

    try {
      await this.likeRepository.addLike(postId, userId);
    } catch (err: unknown) {
      const pgErr = err as { cause?: { code?: string } };
      if (pgErr?.cause?.code === '23505') {
        throw new ConflictException('이미 좋아요를 눌렀습니다.');
      }
      throw err;
    }

    const likeCount = await this.likeRepository.countByPostId(postId);
    return { likeCount, isLiked: true };
  }

  async removeLike(userId: number, postId: number): Promise<LikeResponse> {
    const deleted = await this.likeRepository.removeLike(postId, userId);
    if (deleted === 0) {
      throw new NotFoundException('좋아요를 찾을 수 없습니다.');
    }

    const likeCount = await this.likeRepository.countByPostId(postId);
    return { likeCount, isLiked: false };
  }
}
