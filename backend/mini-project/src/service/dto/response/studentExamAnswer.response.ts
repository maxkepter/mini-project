import { ApiProperty } from '@nestjs/swagger';

export class StudentExamAnswerResponse {
  @ApiProperty({ example: 'Option A' })
  content: string;

  @ApiProperty({ example: true })
  isSelected: boolean;
}
