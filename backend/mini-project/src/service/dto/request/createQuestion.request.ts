import { ApiProperty } from '@nestjs/swagger';
import { OptionRequest } from './option.request';

export class QuestionRequest {
  @ApiProperty({ example: 'What is NestJS?' })
  content: string;

  @ApiProperty({ type: [OptionRequest] })
  options: OptionRequest[];
}
