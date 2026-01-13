import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/domain/repository/UserRepository';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { UserResponse } from './dtos.response';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => {
      const response = new UserResponse();
      response.userId = user.userId;
      response.username = user.username;
      response.role = user.role;
      return response;
    });
  }

  async getUserProfile(userId: number): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const response = new UserResponse();
    response.userId = user.userId;
    response.username = user.username;
    response.role = user.role;
    response.isActive = user.isActive;
    return response;
  }
}
