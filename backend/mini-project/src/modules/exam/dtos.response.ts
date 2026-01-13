import { ApiProperty } from '@nestjs/swagger';

export class ExamSummaryResponse {
  @ApiProperty({ example: 1 })
  examId: number;

  @ApiProperty({ example: 'Final Exam' })
  name: string;

  @ApiProperty({ example: 60 })
  duration: number;

  @ApiProperty({ example: 20 })
  totalQuestions: number;
}
