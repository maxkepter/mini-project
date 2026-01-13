import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/domain/repository/UserRepository';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { UserResponse } from './dtos.response';
import { UserRole } from 'src/domain/enum/UserRole.enum';

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
      response.isActive = user.isActive;
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

  async deactivateUser(userId: number, currentUserId: number): Promise<void> {
    if (userId === currentUserId) {
      throw new Error('Cannot deactivate yourself');
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.update(userId, { isActive: false });
  }

  async activateUser(userId: number): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.update(userId, { isActive: true });

    const updatedUser = await this.userRepository.findById(userId);
    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }
    const response = new UserResponse();
    response.userId = updatedUser.userId;
    response.username = updatedUser.username;
    response.role = updatedUser.role;
    response.isActive = updatedUser.isActive;
    return response;
  }

  async updateUserRole(
    userId: number,
    newRole: UserRole,
    currentUserId: number,
  ): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    //If the user is an admin and the new role is not admin
    if (user.role === UserRole.ADMIN && newRole !== UserRole.ADMIN) {
      // User cannot change their own role
      if (userId === currentUserId) {
        throw new BadRequestException('Cannot change your own role');
      }

      // Count active admins
      const allUsers = await this.userRepository.findAll();
      const adminCount = allUsers.filter(
        (u) => u.role === UserRole.ADMIN && u.isActive,
      ).length;

      // At least one admin must remain
      if (adminCount <= 1) {
        throw new BadRequestException(
          'Cannot change role: must have at least 1 active admin',
        );
      }
    }

    await this.userRepository.update(userId, { role: newRole });

    const updatedUser = await this.userRepository.findById(userId);
    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }
    const response = new UserResponse();
    response.userId = updatedUser.userId;
    response.username = updatedUser.username;
    response.role = updatedUser.role;
    response.isActive = updatedUser.isActive;
    return response;
  }
}
