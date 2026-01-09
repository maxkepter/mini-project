import { ApiProperty } from '@nestjs/swagger';
import { OptionResponse } from './option.response';

export class QuestionResponse {
  @ApiProperty({ example: 1 })
  questionId: number;

  @ApiProperty({ example: 'What is NestJS?' })
  content: string;

  @ApiProperty({ type: [OptionResponse] })
  options: OptionResponse[];
}
