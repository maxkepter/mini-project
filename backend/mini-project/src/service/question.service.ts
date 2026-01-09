import { Injectable } from '@nestjs/common';
import { QuestionRepository } from 'src/domain/repository';
import { CreateQuestionRequest } from './dto/request/createQuestion.request';
import { Option, Question } from 'src/domain/entities';
import { QuestionResponse } from './dto/response/question.respone';
import { OptionMapper } from './mapper/option.mapper';
import { QuestionMapper } from './mapper/question.mapper';

@Injectable()
export class QuestionService {
  constructor(private readonly questionRepo: QuestionRepository) {}
  async createQuestion(
    request: CreateQuestionRequest,
  ): Promise<QuestionResponse> {
    const question: Question = Question.create(
      request.content,
      request.options.map((opt) => Option.create(opt.content, opt.isCorrect)),
    );
    const savedQuestion = await this.questionRepo.create(question);
    const response: QuestionResponse = new QuestionResponse();
    response.questionId = savedQuestion.questionId;
    response.content = savedQuestion.content;
    response.options = savedQuestion.options.map((opt) => {
      return OptionMapper.toResponse(opt);
    });
    return response;
  }

  async deleteQuestion(questionId: number): Promise<void> {
    await this.questionRepo.delete(questionId);
  }

  async getAllQuestions(): Promise<QuestionResponse[]> {
    const questions = await this.questionRepo.findAll();
    return questions.map((question) => QuestionMapper.toResponse(question));
  }
}
