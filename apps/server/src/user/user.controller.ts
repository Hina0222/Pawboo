import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: { user: { id: number; kakaoId: string } }) {
    const user = await this.userService.findById(req.user.id);
    return {
      id: user.id,
      nickname: user.nickname,
      profileImage: user.profileImage ?? null,
    };
  }
}
