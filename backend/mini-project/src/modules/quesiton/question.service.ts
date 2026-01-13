import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionRepository, OptionRepository } from 'src/domain/repository';
import { Option, Question } from 'src/domain/entities';
import { QuestionResponse } from '../../service/dto/response/question.respone';
import { OptionMapper } from '../../service/mapper/option.mapper';
import { QuestionMapper } from '../../service/mapper/question.mapper';
import { QuestionRequest } from 'src/service/dto/request/createQuestion.request';
import { DataSource } from 'typeorm';

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepo: QuestionRepository,
    private readonly optionRepo: OptionRepository,
    private readonly dataSource: DataSource,
  ) {}
  async createQuestion(request: QuestionRequest): Promise<QuestionResponse> {
    const question: Question = Question.create(
      request.content,
      request.options.map((opt) => Option.create(opt.content, opt.isCorrect)),
    );
    console.log('Created Question Entity:', question.options);
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

  async getQuestionById(questionId: number): Promise<QuestionResponse> {
    const question = await this.questionRepo.findById(questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return QuestionMapper.toResponse(question);
  }

  async updateQuestion(
    questionId: number,
    request: QuestionRequest,
  ): Promise<QuestionResponse> {
    if (!request) {
      throw new NotFoundException('Invalid request data');
    }
    if (!questionId) {
      throw new NotFoundException('Invalid question ID');
    }
    if (request.isQuestionValid() === false) {
      throw new NotFoundException('Invalid question data');
    }
    const existingQuestion = await this.questionRepo.findById(questionId);
    if (!existingQuestion) {
      throw new NotFoundException('Question not found');
    }

    // Use transaction to delete old options and update question
    const updatedQuestion = await this.dataSource.transaction(
      async (manager) => {
        // Delete old options
        await manager.delete(Option, { questionId });

        // Update question content
        existingQuestion.content = request.content;
        existingQuestion.options = request.options.map((opt) => {
          const option = Option.create(opt.content, opt.isCorrect);
          option.questionId = questionId;
          return option;
        });

        // Save question with new options
        return await manager.save(Question, existingQuestion);
      },
    );
    if (!updatedQuestion) {
      throw new NotFoundException('Failed to update question');
    }
    const response: QuestionResponse = new QuestionResponse();

    response.questionId = updatedQuestion.questionId;
    response.content = updatedQuestion.content;
    response.options = updatedQuestion.options.map((opt) => {
      return OptionMapper.toResponse(opt);
    });
    return response;
  }
}
