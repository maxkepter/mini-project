import { ApiProperty } from '@nestjs/swagger';

export class OptionRequest {
  @ApiProperty({ example: 'Dependency Injection' })
  content: string;

  @ApiProperty({ example: true })
  isCorrect: boolean;
}
