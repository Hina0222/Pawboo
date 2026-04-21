import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.type';
import type { MeResponse } from '@pawboo/schemas/user';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@Req() req: AuthenticatedRequest): Promise<MeResponse> {
    return this.userService.getMe(req.user.id);
  }
}
