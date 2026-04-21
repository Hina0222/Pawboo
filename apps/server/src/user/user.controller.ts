import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.type';
import {
  SearchQuerySchema,
  type MeResponse,
  type PetSearchResponse,
} from '@pawboo/schemas/user';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@Req() req: AuthenticatedRequest): Promise<MeResponse> {
    return this.userService.getMe(req.user.id);
  }

  @Get('search')
  searchPets(
    @Query() query: Record<string, string>,
  ): Promise<PetSearchResponse> {
    const parsed = SearchQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.userService.searchPets(parsed.data);
  }
}
