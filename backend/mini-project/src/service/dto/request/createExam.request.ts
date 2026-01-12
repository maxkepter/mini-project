import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateExamRequest {
  @ApiProperty({ example: 'Mathematics Final Exam' })
  @IsString()
  name: string;

  @ApiProperty({ example: 60 })
  @IsNumber()
  duration: number;

  @ApiProperty({ example: [1, 2, 3, 4, 5] })
  @IsArray()
  @IsNumber({}, { each: true })
  questionIds: number[];
}
