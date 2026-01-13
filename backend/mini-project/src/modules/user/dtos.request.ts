import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/domain/enum/UserRole.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleRequest {
  @ApiProperty({
    enum: UserRole,
    description: 'The role to assign to the user',
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
