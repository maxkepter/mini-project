import { Injectable } from '@nestjs/common';
import { UserResponse } from './dto/response/user.response';
import { UserRepository } from 'src/domain/repository/UserRepository';

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
}
