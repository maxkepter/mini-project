/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserResponse } from './dtos.response';
import { JwtGuard } from '../auth/jwt.guard';
import { UserService } from './user.service';

@Controller('api/user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('profile')
  async getProfile(@Req() req: any): Promise<UserResponse> {
    if (req.user === undefined) {
      throw new Error('Unauthorized');
    }
    const userId = req.user.userId;
    return this.userService.getUserProfile(userId);
  }
}
