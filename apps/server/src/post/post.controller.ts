import {
  Controller,
  Post,
  UseGuards,
  Req,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostService } from './post.service';
import { ImagesUpload } from '../common/decorators/image-upload.decorator';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.type';
import type { PostResponse } from '@pawboo/schemas/mission';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ImagesUpload()
  async createPost(
    @Req() req: AuthenticatedRequest,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<PostResponse> {
    if (!files || files.length === 0) {
      throw new BadRequestException('이미지를 1장 이상 업로드해주세요.');
    }
    if (files.length > 5) {
      throw new BadRequestException('이미지는 최대 5장까지 업로드 가능합니다.');
    }
    return this.postService.createPost(
      req.user.id,
      files.map((f) => f.buffer),
    );
  }
}
