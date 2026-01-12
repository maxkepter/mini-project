import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, RefreshToken } from 'src/domain/entities';
import { RefreshTokenRepository } from 'src/domain/repository';
import { v4 as uuidv4 } from 'uuid';
import { AuthResponse } from '../../service/dto/response/auth.respone';
import { RefreshTokenRequest } from './dtos';

@Injectable()
export class TokenService {
  private static readonly REFRESH_TOKEN_EXPIRATION_DAYS = process.env
    .REFRESH_TOKEN_EXPIRATION_DAYS
    ? parseInt(process.env.REFRESH_TOKEN_EXPIRATION_DAYS, 10)
    : 7;
  private static readonly JWT_SECRET =
    process.env.JWT_SECRET ?? 'defaultSecretKey';

  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  generateAccessToken(userId: number, username: string, role: number): string {
    const payload = { userId, username, role };
    return this.jwtService.sign(payload, { secret: TokenService.JWT_SECRET });
  }

  async createRefreshToken(user: User): Promise<string> {
    const tokenValue = uuidv4();
    const refreshToken = RefreshToken.create(
      tokenValue,
      new Date(
        Date.now() +
          TokenService.REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000,
      ),
      user.userId,
    );
    await this.refreshTokenRepository.create(refreshToken);
    return tokenValue;
  }

  async refreshAccessToken(
    request: RefreshTokenRequest,
  ): Promise<AuthResponse> {
    const storedToken = await this.refreshTokenRepository.findByToken(
      request.refreshToken,
    );
    if (!storedToken?.isTokenValid()) {
      throw new Error('Invalid or expired refresh token');
    }

    const { user } = storedToken;
    return {
      userId: user.userId,
      username: user.username,
      role: user.role,
      accessToken: this.generateAccessToken(
        user.userId,
        user.username,
        user.role,
      ),
      refreshToken: storedToken.token,
    };
  }

  async revokeRefreshToken(token: string): Promise<boolean> {
    return await this.refreshTokenRepository.revokeByToken(token);
  }
}
