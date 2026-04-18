import {
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
  Param,
  Query,
  Body,
  ParseIntPipe,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { ImageUpload } from '../common/decorators/image-upload.decorator';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.type';
import { ProfileUpdateSchema } from '@pawboo/schemas/user';
import {
  UserSearchQuerySchema,
  type SearchResponse,
  type UserProfileResponse,
} from '@pawboo/schemas/user';
import type { FeedListResponse } from '@pawboo/schemas/feed';
import type { PetResponse } from '@pawboo/schemas/pet';
import type { PetSubmissionHistoryResponse } from '@pawboo/schemas/mission';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    const user = await this.userService.findById(req.user.id);
    return {
      id: user.id,
      nickname: user.nickname,
      profileImage: user.profileImage ?? null,
      followerCount: user.followerCount,
      followingCount: user.followingCount,
    };
  }

  @Patch('me')
  @ImageUpload()
  async updateMe(
    @Req() req: AuthenticatedRequest,
    @Body() body: Record<string, string>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const parsed = ProfileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.userService.updateMe(req.user.id, parsed.data, file?.buffer);
  }

  @Get('search')
  searchUsers(
    @Req() req: AuthenticatedRequest,
    @Query() query: Record<string, string>,
  ): Promise<SearchResponse> {
    const parsed = UserSearchQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.userService.searchUsers(req.user.id, parsed.data);
  }

  @Get(':id')
  getPublicProfile(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserProfileResponse> {
    return this.userService.getPublicProfile(req.user.id, id);
  }

  @Get(':id/pets/:petId')
  getPublicPet(
    @Param('id', ParseIntPipe) userId: number,
    @Param('petId', ParseIntPipe) petId: number,
  ): Promise<PetResponse> {
    return this.userService.getPublicPet(userId, petId);
  }

  @Get(':id/pets/:petId/submissions')
  getPetSubmissions(
    @Param('id', ParseIntPipe) userId: number,
    @Param('petId', ParseIntPipe) petId: number,
    @Query() query: Record<string, string>,
  ): Promise<PetSubmissionHistoryResponse> {
    const limit = query.limit ? Number(query.limit) : 20;
    const cursor = query.cursor ? Number(query.cursor) : undefined;
    return this.userService.getPetPublicSubmissions(
      userId,
      petId,
      limit,
      cursor,
    );
  }

  @Get(':id/feeds')
  getUserFeeds(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Query() query: Record<string, string>,
  ): Promise<FeedListResponse> {
    const cursor = query.cursor ? Number(query.cursor) : undefined;
    const limit = query.limit ? Number(query.limit) : undefined;
    return this.userService.getUserFeeds(req.user.id, id, { cursor, limit });
  }
}
