import { ApiProperty } from '@nestjs/swagger';
import { ExamStatus } from 'src/domain/enum';
import { QuestionResponse } from './question.respone';

export class ExamResponse {
  @ApiProperty({ example: 1 })
  examId: number;

  @ApiProperty({ example: 'Final Exam' })
  name: string;

  @ApiProperty({ example: 60 })
  duration: number;

  @ApiProperty({
    example: ExamStatus.PUBLISHED,
    description: 'ExamStatus enum',
  })
  status: ExamStatus;

  @ApiProperty({ type: [QuestionResponse] })
  questions: QuestionResponse[];
}
