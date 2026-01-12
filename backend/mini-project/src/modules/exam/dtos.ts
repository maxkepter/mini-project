import { ApiProperty } from '@nestjs/swagger';

export class CreateExamRequest {
  @ApiProperty({ example: 'Final Exam' })
  name: string;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  duration: number;

  @ApiProperty({ type: [Number], example: [1, 2, 3] })
  questionIds: number[];
}
