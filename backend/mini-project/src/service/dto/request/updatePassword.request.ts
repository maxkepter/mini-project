import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordRequest {
  @ApiProperty({ example: 'student1' })
  username: string;

  @ApiProperty({ example: 'oldPass123' })
  oldPassword: string;

  @ApiProperty({ example: 'newPass123' })
  newPassword: string;
}
