import { Body, Controller, Post } from '@nestjs/common';
import { ExamService } from 'src/modules/exam/exam.service';
import { CreateExamRequest } from 'src/service/dto/request/createExam.request';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin Exams')
@Controller('api/admin/exams')
export class AdminExamController {
  constructor(private readonly examService: ExamService) {}
  @Post()
  @ApiOperation({ summary: 'Create exam' })
  @ApiResponse({ status: 201 })
  async createExam(@Body() request: CreateExamRequest): Promise<unknown> {
    return await this.examService.createExam(request);
  }
}
