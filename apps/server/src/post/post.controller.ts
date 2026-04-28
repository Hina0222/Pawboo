import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  Req,
  UploadedFiles,
  BadRequestException,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostService } from './post.service';
import {
  ImagesUpload,
  ImagesValidationPipe,
} from '../common/decorators/image-upload.decorator';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.type';
import {
  PostQuerySchema,
  type PostResponse,
  type PostDetail,
  type PostListResponse,
} from '@pawboo/schemas/post';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ImagesUpload()
  async createPost(
    @Req() req: AuthenticatedRequest,
    @UploadedFiles(new ImagesValidationPipe()) files: Express.Multer.File[],
  ): Promise<PostResponse> {
    return this.postService.createPost(
      req.user.id,
      files.map((f) => f.buffer),
    );
  }

  @Get()
  findPosts(@Query() query: Record<string, string>): Promise<PostListResponse> {
    const parsed = PostQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.postService.findPosts(parsed.data);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMyPosts(
    @Req() req: AuthenticatedRequest,
    @Query() query: Record<string, string>,
  ): Promise<PostListResponse> {
    const parsed = PostQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.postService.findMyPosts(req.user.id, parsed.data);
  }

  @Get('pets/:petId')
  @UseGuards(JwtAuthGuard)
  findPetPosts(
    @Param('petId', ParseIntPipe) petId: number,
    @Query() query: Record<string, string>,
  ): Promise<PostListResponse> {
    const parsed = PostQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.postService.findPetPosts(petId, parsed.data);
  }

  @Get('liked')
  @UseGuards(JwtAuthGuard)
  findLikedPosts(
    @Req() req: AuthenticatedRequest,
    @Query() query: Record<string, string>,
  ): Promise<PostListResponse> {
    const parsed = PostQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.postService.findLikedPosts(req.user.id, parsed.data);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOnePost(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostDetail> {
    return this.postService.findOnePost(req.user.id, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePost(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.postService.deletePost(req.user.id, id);
  }
}
