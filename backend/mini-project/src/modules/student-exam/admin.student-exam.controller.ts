import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StudentExamService } from './student-exam.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from 'src/domain/enum/UserRole.enum';
import { StudentExamSummaryResponse } from './dtos.response';

@Controller('api/admin/student/exams')
@ApiTags('Admin Student Exams')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminStudentExamController {
  constructor(private readonly studentExamService: StudentExamService) {}
  @Get(':examId')
  @ApiOperation({ summary: 'Get student exams by exam id' })
  @ApiOkResponse({ type: [StudentExamSummaryResponse] })
  async getStudentExamsByExamId(
    @Param('examId') examId: number,
  ): Promise<StudentExamSummaryResponse[]> {
    return await this.studentExamService.getStudentExamByExamId(examId);
  }
}
