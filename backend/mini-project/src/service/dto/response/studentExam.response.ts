import { ApiProperty } from '@nestjs/swagger';
import { StudentExamQuestionResponse } from './studentExamQuestion.response';

export class StudentExamResponse {
  @ApiProperty({ example: 1 })
  studentExamId: number;

  @ApiProperty({ example: 1, description: 'StudentExamStatus enum value' })
  status: number;

  @ApiProperty({ example: '2026-01-06T09:00:00Z' })
  startTime: Date;

  @ApiProperty({ example: '2026-01-06T09:30:00Z', nullable: true })
  submitTime: Date | null;

  @ApiProperty({ example: 8, description: 'Score if available' })
  score: number;

  @ApiProperty({ example: 3 })
  userId: number;

  @ApiProperty({ example: 1 })
  examId: number;

  @ApiProperty({ type: [StudentExamQuestionResponse] })
  studentExamQuestions: StudentExamQuestionResponse[];
}
