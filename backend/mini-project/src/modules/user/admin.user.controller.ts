import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserResponse } from 'src/service/dto/response/user.response';
import { UserService } from 'src/modules/user/user.service';
import { JwtGuard } from 'src/modules/auth/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('api/admin/users')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class AdminUserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getAllUsers(): Promise<UserResponse[]> {
    return await this.userService.getAllUsers();
  }
}
