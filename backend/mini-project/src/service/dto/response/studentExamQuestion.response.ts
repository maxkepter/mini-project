import { ApiProperty } from '@nestjs/swagger';
import { StudentExamAnswerResponse } from './studentExamAnswer.response';

export class StudentExamQuestionResponse {
  @ApiProperty({ example: 1 })
  studentExamQuestionId: number;
  @ApiProperty({ example: 'What is TypeScript?' })
  content: string;

  @ApiProperty({ type: [StudentExamAnswerResponse] })
  options: StudentExamAnswerResponse[];
}
