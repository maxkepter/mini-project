import { ApiProperty } from '@nestjs/swagger';
import { OptionRequest } from './option.request';
import { IsNotEmpty } from 'class-validator';

export class QuestionRequest {
  @ApiProperty({ example: 'What is NestJS?' })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: [OptionRequest] })
  options: OptionRequest[];

  isQuestionValid(): boolean {
    if (!this.content || this.content.trim() === '') {
      return false;
    }
    if (!this.options || this.options.length < 2) {
      return false;
    }
    const hasCorrectOption = this.options.some((opt) => opt.isCorrect);
    if (!hasCorrectOption) {
      return false;
    }
    return true;
  }
}
