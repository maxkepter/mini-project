import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'student1' })
  username: string;

  @ApiProperty({ example: 2, description: 'UserRole enum value' })
  role: number;

  @ApiProperty({ example: true })
  isActive: boolean;
}
