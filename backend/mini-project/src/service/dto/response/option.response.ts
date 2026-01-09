import { ApiProperty } from '@nestjs/swagger';

export class OptionResponse {
  @ApiProperty({ example: 1 })
  optionId: number;

  @ApiProperty({ example: 'Dependency Injection' })
  content: string;

  @ApiProperty({ example: true })
  isCorrect: boolean;
}
