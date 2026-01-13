import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
  };
}
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SelectOptionRequest } from 'src/service/dto/request/selectOption.request';
import { StudentExamCreationRequest } from 'src/service/dto/request/studentExamCreation.request';
import { StudentExamResponse } from 'src/service/dto/response/studentExam.response';
import { StudentExamService } from 'src/modules/student-exam/student-exam.service';
import { JwtGuard } from '../auth/jwt.guard';
import { StudentExamSummaryResponse } from './dtos.response';

@ApiTags('Student Exams')
@Controller('api/student/exams')
@UseGuards(JwtGuard)
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
    @Param('id') studentExamId: number,
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
    @Req() req: AuthenticatedRequest,
  ): Promise<StudentExamSummaryResponse[]> {
    if (!req.user?.userId) {
      throw new BadRequestException('User information not found in request');
    }
    const userId = req.user.userId;
    return await this.studentExamService.getStudentExamByUserId(userId);
  }
  @Put('submit')
  @ApiOperation({ summary: 'Submit a student exam' })
  @ApiResponse({ status: 200, type: StudentExamResponse })
  async submitExam(
    @Body('studentExamId') studentExamId: number,
  ): Promise<StudentExamResponse> {
    return await this.studentExamService.submitExam(studentExamId);
  }
}
