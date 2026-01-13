import { User } from 'src/domain/entities';
import { UserResponse } from 'src/modules/user/dtos.response';

export class UserMapper {
  static toResponse(entity: User): UserResponse {
    const response = new UserResponse();
    response.userId = entity.userId;
    response.username = entity.username;
    response.role = entity.role;
    return response;
  }
}
