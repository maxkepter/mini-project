import { ApiProperty } from '@nestjs/swagger';

export class StudentExamCreationRequest {
  @ApiProperty({ example: 1 })
  examId: number;

  @ApiProperty({ example: 3 })
  userId: number;
}
