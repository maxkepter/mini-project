import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'student1' })
  username: string;

  @ApiProperty({ example: 2, description: 'UserRole enum value' })
  role: number;

  @ApiProperty({ example: 'jwt-access-token', required: false })
  accessToken?: string;

  @ApiProperty({ example: 'jwt-refresh-token', required: false })
  refreshToken?: string;
}
