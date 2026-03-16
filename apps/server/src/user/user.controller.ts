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
import { ProfileUpdateSchema } from '@bragram/schemas/user';
import {
  UserSearchQuerySchema,
  type UserSearchResponse,
  type UserProfileResponse,
} from '@bragram/schemas/follow';
import type { FeedListResponse } from '@bragram/schemas/feed';

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
  ): Promise<UserSearchResponse> {
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
