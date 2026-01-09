import { ApiProperty } from '@nestjs/swagger';

export class SelectOptionRequest {
  @ApiProperty({ example: 10, description: 'studentExamAnswerId' })
  optionId: number;

  @ApiProperty({ example: true })
  isSelected: boolean;
}
