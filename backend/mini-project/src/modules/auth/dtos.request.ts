import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenRequest {
  @ApiProperty({ example: 'jwt-refresh-token' })
  @IsNotEmpty()
  refreshToken: string;
}
