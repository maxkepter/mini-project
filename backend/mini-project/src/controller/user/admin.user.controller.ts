import { Controller, Get } from '@nestjs/common';
import { UserResponse } from 'src/service/dto/response/user.response';
import { UserService } from 'src/service/user.service';

@Controller('api/admin/users')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getAllUsers(): Promise<UserResponse[]> {
    return await this.userService.getAllUsers();
  }
}
