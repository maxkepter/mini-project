import { UserRepository } from 'src/domain/repository';
import { AuthRequest } from './dto/request/auth.request';
import { Injectable } from '@nestjs/common';
import { User } from 'src/domain/entities/User.entity';
import { UserRole } from 'src/domain/enum/UserRole.enum';
import { sha256 } from 'src/utils/hash.utils';
import { AuthResponse } from './dto/response/auth.respone';
import { UpdatePasswordRequest } from './dto/request/updatePassword.request';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}
  async register(request: AuthRequest) {
    if (await this.userRepository.isExistingUser(request.username)) {
      throw new Error('User already exists');
    }
    const newUser: User = new User();
    newUser.username = request.username;
    newUser.password = sha256(request.password);
    newUser.role = UserRole.STUDENT;
    await this.userRepository.create(newUser);
  }

  async login(request: AuthRequest): Promise<AuthResponse> {
    const user = await this.userRepository.findByUserName(request.username);
    if (!user || user.password !== sha256(request.password)) {
      throw new Error('Invalid username or password');
    }
    const response: AuthResponse = new AuthResponse();
    response.username = user.username;
    response.role = user.role;
    return response;
  }

  async updatePassword(request: UpdatePasswordRequest): Promise<AuthResponse> {
    const user = await this.userRepository.findByUserName(request.username);
    if (!user || user.password !== sha256(request.oldPassword)) {
      throw new Error('Invalid username or password');
    }
    user.password = sha256(request.newPassword);
    await this.userRepository.update(user.userId, user);
    const response: AuthResponse = new AuthResponse();
    response.username = user.username;
    response.role = user.role;
    return response;
  }
}
