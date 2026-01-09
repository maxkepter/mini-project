import { ApiProperty } from '@nestjs/swagger';

export class StudentExamAnswerSelectRequest {
  @ApiProperty({ example: 10 })
  studentExamAnswerId: number;

  @ApiProperty({ example: true })
  isSelected: boolean;
}

export class StudentExamSelectionRequest {
  @ApiProperty({ example: 5 })
  studentExamId: number;

  @ApiProperty({ type: [StudentExamAnswerSelectRequest] })
  selections: StudentExamAnswerSelectRequest[];
}
