import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExamSummaryResponse } from 'src/service/dto/response/examSumary.respone';
import { ExamService } from 'src/service/exam.service';

@ApiTags('User Exams')
@Controller('api/user/exams')
export class UserExamController {
  constructor(private readonly examService: ExamService) {}

  @Get()
  @ApiOperation({ summary: 'Get all exams (summary)' })
  @ApiResponse({ status: 200, type: [ExamSummaryResponse] })
  async getAllExams(): Promise<ExamSummaryResponse[]> {
    return await this.examService.getAllExams();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exam by id' })
  @ApiResponse({ status: 200 })
  async getExam(@Param('id') id: string): Promise<unknown> {
    return await this.examService.getExamById(Number(id));
  }
}
