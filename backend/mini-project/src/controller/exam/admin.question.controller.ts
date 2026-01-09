import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateQuestionRequest } from 'src/service/dto/request/createQuestion.request';
import { QuestionService } from 'src/service/question.service';

@ApiTags('Admin Questions')
@Controller('api/admin/questions')
export class AdminQuestionController {
  constructor(private readonly questionService: QuestionService) {}
  @Post()
  @ApiOperation({ summary: 'Create question' })
  @ApiResponse({ status: 201 })
  async createQuestion(
    @Body() request: CreateQuestionRequest,
  ): Promise<unknown> {
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
}
