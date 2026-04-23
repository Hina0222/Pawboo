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
  type PostItem,
  type PostListResponse,
} from '@pawboo/schemas/post';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
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
  findPosts(
    @Req() req: AuthenticatedRequest,
    @Query() query: Record<string, string>,
  ): Promise<PostListResponse> {
    const parsed = PostQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.postService.findPosts(req.user.id, parsed.data);
  }

  @Get('me')
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
  findPetPosts(
    @Req() req: AuthenticatedRequest,
    @Param('petId', ParseIntPipe) petId: number,
    @Query() query: Record<string, string>,
  ): Promise<PostListResponse> {
    const parsed = PostQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.postService.findPetPosts(req.user.id, petId, parsed.data);
  }

  @Get('liked')
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
  findOnePost(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostItem> {
    return this.postService.findOnePost(req.user.id, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePost(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.postService.deletePost(req.user.id, id);
  }
}
