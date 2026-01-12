import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SelectOptionRequest } from 'src/service/dto/request/selectOption.request';
import { StudentExamCreationRequest } from 'src/service/dto/request/studentExamCreation.request';
import { StudentExamResponse } from 'src/service/dto/response/studentExam.response';
import { StudentExamSummaryResponse } from 'src/service/dto/response/studentExamSumary.response';
import { StudentExamService } from 'src/modules/student-exam/student-exam.service';

@ApiTags('Student Exams')
@Controller('api/student/exams')
export class StudentExamController {
  constructor(private readonly studentExamService: StudentExamService) {}
  @Post('take-exam')
  @ApiOperation({ summary: 'Start a student exam' })
  @ApiResponse({ status: 201, type: StudentExamResponse })
  async takeExam(
    @Body() request: StudentExamCreationRequest,
  ): Promise<StudentExamResponse> {
    return await this.studentExamService.createStudentExam(request);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student exam by ID' })
  @ApiResponse({ status: 200, type: StudentExamResponse })
  async getStudentExamById(
    @Body('studentExamId') studentExamId: number,
  ): Promise<StudentExamResponse | null> {
    return await this.studentExamService.getStudentExamById(studentExamId);
  }

  @Post('select-option')
  @ApiOperation({ summary: 'Select an option for a student exam answer' })
  @ApiResponse({ status: 200 })
  async selectOption(@Body() request: SelectOptionRequest): Promise<void> {
    return await this.studentExamService.selectOption(request);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get exam history for a student' })
  @ApiResponse({ status: 200, type: [StudentExamSummaryResponse] })
  async getExamHistory(
    @Body('userId') userId: number,
  ): Promise<StudentExamSummaryResponse[]> {
    return await this.studentExamService.getStudentExamByUserId(userId);
  }
  @Put('submit')
  @ApiOperation({ summary: 'Submit a student exam' })
  @ApiResponse({ status: 200, type: StudentExamResponse })
  async submitExam(studentExamId: number): Promise<StudentExamResponse> {
    return await this.studentExamService.submitExam(studentExamId);
  }
}
