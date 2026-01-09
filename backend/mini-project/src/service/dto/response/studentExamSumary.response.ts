import { ApiProperty } from '@nestjs/swagger';

export class StudentExamSummaryResponse {
  @ApiProperty({ example: 1 })
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
