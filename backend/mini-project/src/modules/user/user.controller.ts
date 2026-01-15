/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserResponse } from './dtos.response';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from 'src/domain/enum/UserRole.enum';
import { UserService } from './user.service';

@Controller('api/user')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.STUDENT, UserRole.ADMIN, UserRole.SUB_ADMIN)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get student profile' })
  @ApiOkResponse({ type: UserResponse })
  async getProfile(@Req() req: any): Promise<UserResponse> {
    if (req.user === undefined) {
      throw new Error('Unauthorized');
    }
    const userId = req.user.userId;
    return this.userService.getUserProfile(userId);
  }
}
