import { User } from 'src/domain/entities';
import { UserResponse } from '../dto/response/user.response';

export class UserMapper {
  static toResponse(entity: User): UserResponse {
    const response = new UserResponse();
    response.userId = entity.userId;
    response.username = entity.username;
    response.role = entity.role;
    return response;
  }
}
