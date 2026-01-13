import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExamService } from 'src/modules/exam/exam.service';
import { ExamResponse } from 'src/service/dto/response/exam.respone';
import { ExamSummaryResponse } from './dtos.response';

@ApiTags('User Exams')
@Controller('api/user/exams')
export class UserExamController {
  constructor(private readonly examService: ExamService) {}

  @Get()
  @ApiOperation({ summary: 'Get all exams' })
  @ApiResponse({ status: 200 })
  async getAllExams(
    @Query('name') name?: string,
  ): Promise<ExamSummaryResponse[]> {
    return await this.examService.searchExamsByName(name ?? '');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exam by id' })
  @ApiResponse({ status: 200 })
  async getExam(@Param('id') id: string): Promise<ExamResponse | null> {
    return await this.examService.getExamById(Number(id));
  }
}
