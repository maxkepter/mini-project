import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RefreshTokenRequest {
  @ApiProperty({ example: 'jwt-refresh-token' })
  @IsNotEmpty()
  refreshToken: string;
}

export class UpdatePasswordRequest {
  @ApiProperty({ example: 'student1' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'oldPass123' })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ example: 'newPass123' })
  @IsNotEmpty()
  newPassword: string;
}

export class AuthRequest {
  @ApiProperty({ example: 'student1' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
