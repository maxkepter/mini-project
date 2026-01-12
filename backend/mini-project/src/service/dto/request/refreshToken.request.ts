import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenRequest {
  @ApiProperty({ example: 'jwt-refresh-token' })
  @IsString()
  refreshToken: string;
}
