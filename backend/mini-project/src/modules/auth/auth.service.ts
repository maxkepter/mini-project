/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { UserRepository } from 'src/domain/repository';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { User } from 'src/domain/entities/User.entity';
import { UserRole } from 'src/domain/enum/UserRole.enum';
import { sha256 } from 'src/utils/hash.utils';
import { TokenService } from './token.service';
import { AuthResponse } from './dtos.response';
import { AuthRequest, UpdatePasswordRequest } from './dtos.request';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}
  async register(request: AuthRequest) {
    if (await this.userRepository.isExistingUser(request.username)) {
      throw new ConflictException('User already exists');
    }
    if (request.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }
    const newUser: User = new User();
    newUser.username = request.username;
    newUser.password = sha256(request.password);
    newUser.role = UserRole.STUDENT;
    await this.userRepository.create(newUser);
  }

  async login(request: AuthRequest): Promise<AuthResponse> {
    const user = await this.userRepository.findByUserName(request.username);
    if (user?.password !== sha256(request.password)) {
      throw new BadRequestException('Invalid username or password');
    }

    if (!user.isActive) {
      throw new BadRequestException('User account is deactivated');
    }

    const payload: AuthResponse = {
      userId: user.userId,
      username: user.username,
      role: user.role,
    };
    const accessToken = this.tokenService.generateAccessToken(
      user.userId,
      user.username,
      user.role,
    );
    const refreshToken = await this.tokenService.createRefreshToken(user);
    return { ...payload, accessToken, refreshToken };
  }

  // update password

  async updatePassword(request: UpdatePasswordRequest): Promise<AuthResponse> {
    if (request.newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }
    const user = await this.userRepository.findByUserName(request.username);
    if (user?.password !== sha256(request.oldPassword)) {
      throw new BadRequestException('Invalid username or password');
    }
    user.password = sha256(request.newPassword);
    await this.userRepository.update(user.userId, { password: user.password });
    // revoke all existing refresh tokens after password change
    await this.tokenService.revokeTokensByUserId(user.userId);
    const response: AuthResponse = new AuthResponse();
    response.username = user.username;
    response.role = user.role;
    return response;
  }
}
