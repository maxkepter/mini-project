import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ExamService } from 'src/modules/exam/exam.service';
import { CreateExamRequest } from 'src/service/dto/request/createExam.request';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from 'src/domain/enum/UserRole.enum';

@ApiTags('Admin Exams')
@Controller('api/admin/exams')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminExamController {
  constructor(private readonly examService: ExamService) {}
  @Post()
  @ApiOperation({ summary: 'Create exam' })
  @ApiResponse({ status: 201 })
  async createExam(@Body() request: CreateExamRequest): Promise<unknown> {
    return await this.examService.createExam(request);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update exam' })
  @ApiResponse({ status: 200 })
  async updateExam(
    @Param('id') id: number,
    @Body() request: CreateExamRequest,
  ): Promise<unknown> {
    return await this.examService.updateExam(id, request);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete exam' })
  @ApiResponse({ status: 200 })
  async deleteExam(@Param('id') id: number): Promise<{ success: boolean }> {
    const success = await this.examService.deleteExam(id);
    return { success };
  }
}
