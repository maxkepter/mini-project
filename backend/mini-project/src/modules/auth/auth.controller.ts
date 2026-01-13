import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthRequest } from 'src/service/dto/request/auth.request';
import { UpdatePasswordRequest } from 'src/service/dto/request/updatePassword.request';
import { RefreshTokenRequest } from './dtos.request';
import { TokenService } from './token.service';
import { AuthResponse } from './dtos.response';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}
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

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'New access token generated',
    type: AuthResponse,
  })
  @Post('refresh')
  async refresh(@Body() request: RefreshTokenRequest): Promise<AuthResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.tokenService.refreshAccessToken(request);
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
