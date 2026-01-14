import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QuestionService } from 'src/modules/quesiton/question.service';
import { QuestionRequest } from 'src/service/dto/request/createQuestion.request';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from 'src/domain/enum/UserRole.enum';

@ApiTags('Admin Questions')
@Controller('api/admin/questions')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminQuestionController {
  constructor(private readonly questionService: QuestionService) {}
  @Post()
  @ApiOperation({ summary: 'Create question' })
  @ApiResponse({ status: 201 })
  async createQuestion(@Body() request: QuestionRequest): Promise<unknown> {
    return await this.questionService.createQuestion(request);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete question by id' })
  @ApiResponse({ status: 200 })
  async deleteQuestion(@Param('id') id: string): Promise<void> {
    await this.questionService.deleteQuestion(Number(id));
  }

  @Get()
  @ApiOperation({ summary: 'Get all questions' })
  @ApiResponse({ status: 200 })
  async getAllQuestions(): Promise<unknown> {
    return await this.questionService.getAllQuestions();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update question by id' })
  @ApiResponse({ status: 200 })
  async updateQuestion(
    @Param('id') id: string,
    @Body() request: QuestionRequest,
  ): Promise<unknown> {
    return await this.questionService.updateQuestion(Number(id), request);
  }
}
