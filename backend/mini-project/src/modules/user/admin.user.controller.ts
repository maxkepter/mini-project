/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { JwtGuard } from 'src/modules/auth/jwt.guard';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { UserRole } from 'src/domain/enum/UserRole.enum';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UserResponse } from './dtos.response';
import { UpdateRoleRequest } from './dtos.request';

@Controller('api/admin/users')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminUserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ type: [UserResponse] })
  async getAllUsers(): Promise<UserResponse[]> {
    return await this.userService.getAllUsers();
  }
  @Get('profile/:userId')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiOkResponse({ type: UserResponse })
  async getUserProfile(@Param('id') id: number): Promise<UserResponse> {
    return await this.userService.getUserProfile(id);
  }
  @Delete(':userId')
  @ApiOperation({ summary: 'Deactivate a user by ID' })
  @ApiResponse({ status: 204, description: 'User deactivated successfully' })
  async deactivateUser(
    @Param('userId') userId: number,
    @Req() req: any,
  ): Promise<void> {
    if (!req?.user?.userId) {
      throw new Error('Unauthorized');
    }
    const currentUserId = req.user.userId;
    return await this.userService.deactivateUser(userId, currentUserId);
  }

  @Patch(':userId/activate')
  @ApiOperation({ summary: 'Activate a user by ID' })
  @ApiOkResponse({ type: UserResponse })
  async activateUser(
    @Param('userId') userId: number,
    @Req() req: any,
  ): Promise<UserResponse> {
    if (!req?.user?.userId) {
      throw new Error('Unauthorized');
    }
    return await this.userService.activateUser(userId);
  }

  @Patch(':userId/role')
  @ApiOperation({ summary: 'Update user role' })
  @ApiOkResponse({ type: UserResponse })
  async updateUserRole(
    @Param('userId') userId: number,
    @Body() updateRoleRequest: UpdateRoleRequest,
    @Req() req: any,
  ): Promise<UserResponse> {
    if (!req?.user?.userId) {
      throw new Error('Unauthorized');
    }
    const currentUserId = req.user.userId;
    return await this.userService.updateUserRole(
      userId,
      updateRoleRequest.role,
      currentUserId,
    );
  }
}
