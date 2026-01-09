import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({ example: 'student1' })
  username: string;

  @ApiProperty({ example: 2, description: 'UserRole enum value' })
  role: number;
}
