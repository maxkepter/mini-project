import { ApiProperty } from '@nestjs/swagger';

export class StudentExamSummaryResponse {
  @ApiProperty({ example: 1 })
  studentExamId: number;
  @ApiProperty({ example: 1 })
  userId: number;
  @ApiProperty({ example: 'John Doe' })
  userName: string;
  @ApiProperty({ example: 1 })
  examId: number;
  @ApiProperty({ example: 'Math Exam 101' })
  examName: string;
  @ApiProperty({ example: new Date() })
  startTime: Date;
  @ApiProperty({ example: new Date() })
  submitTime: Date;
  @ApiProperty({ example: 1 })
  status: number;
  @ApiProperty({ example: 85 })
  score: number;
}
