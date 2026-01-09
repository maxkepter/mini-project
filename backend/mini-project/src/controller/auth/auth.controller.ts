import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/service/auth.service';
import { AuthRequest } from 'src/service/dto/request/auth.request';
import { UpdatePasswordRequest } from 'src/service/dto/request/updatePassword.request';
import { AuthResponse } from 'src/service/dto/response/auth.respone';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async resgester(@Body() request: AuthRequest): Promise<void> {
    return await this.authService.register(request);
  }
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: AuthResponse,
  })
  @Post('login')
  async login(@Body() request: AuthRequest): Promise<AuthResponse> {
    return await this.authService.login(request);
  }
  @Post('change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    type: AuthResponse,
  })
  async changePassword(
    @Body() request: UpdatePasswordRequest,
  ): Promise<AuthResponse> {
    return await this.authService.updatePassword(request);
  }
}
