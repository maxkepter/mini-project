import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { JwtGuard } from 'src/modules/auth/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserResponse } from './dtos.response';

@Controller('api/admin/users')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class AdminUserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getAllUsers(): Promise<UserResponse[]> {
    return await this.userService.getAllUsers();
  }
  @Get('profile/:userId')
  async getUserProfile(@Param('id') id: number): Promise<UserResponse> {
    return await this.userService.getUserProfile(id);
  }
}
