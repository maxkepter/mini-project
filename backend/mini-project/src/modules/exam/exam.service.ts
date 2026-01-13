import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExamRepository, QuestionRepository } from 'src/domain/repository';
import { CreateExamRequest } from '../../service/dto/request/createExam.request';
import { Exam } from 'src/domain/entities';
import { ExamStatus } from 'src/domain/enum';
import { ExamResponse } from '../../service/dto/response/exam.respone';
import { ExamMapper } from '../../service/mapper/exam.mapper';
import { DataSource } from 'typeorm';
import { ExamSummaryResponse } from './dtos.response';

@Injectable()
export class ExamService {
  constructor(
    private readonly examRepo: ExamRepository,
    private readonly questionRepo: QuestionRepository,
    private readonly dataSource: DataSource,
  ) {}
  async createExam(request: CreateExamRequest): Promise<ExamResponse> {
    if (!(await this.questionRepo.isExist(request.questionIds))) {
      throw new Error('One or more questions do not exist');
    }
    const questions = await this.questionRepo.findByIds(request.questionIds);

    const exam = Exam.create(
      request.name,
      request.duration,
      ExamStatus.PUBLISHED,
      questions,
    );

    return ExamMapper.toResponse(await this.examRepo.create(exam));
  }

  async getExamById(examId: number): Promise<ExamResponse | null> {
    const exam = await this.examRepo.findById(examId);
    if (!exam) {
      return null;
    }
    return ExamMapper.toResponse(exam);
  }

  async searchExamsByName(name: string): Promise<ExamSummaryResponse[]> {
    return await this.examRepo.getExamsByName(name);
  }

  async deleteExam(examId: number): Promise<boolean> {
    return await this.examRepo.delete(examId);
  }

  async updateExam(
    examId: number,
    request: CreateExamRequest,
  ): Promise<ExamResponse> {
    if (!request) {
      throw new BadRequestException('Invalid request data');
    }
    if (!examId) {
      throw new BadRequestException('Invalid exam ID');
    }

    const existingExam = await this.examRepo.findById(examId);
    if (!existingExam) {
      throw new NotFoundException('Exam not found');
    }

    // Verify all questions exist
    if (!(await this.questionRepo.isExist(request.questionIds))) {
      throw new NotFoundException('One or more questions do not exist');
    }

    const questions = await this.questionRepo.findByIds(request.questionIds);

    // Use transaction to clear old questions and update exam
    const updatedExam = await this.dataSource.transaction(async (manager) => {
      // Clear existing question relationships
      await manager
        .createQueryBuilder()
        .delete()
        .from('ExamQuestion')
        .where('examId = :examId', { examId })
        .execute();

      // Update exam properties
      existingExam.name = request.name;
      existingExam.duration = request.duration;
      existingExam.questions = questions;

      // Save exam with new questions
      return await manager.save(Exam, existingExam);
    });

    if (!updatedExam) {
      throw new NotFoundException('Failed to update exam');
    }

    return ExamMapper.toResponse(updatedExam);
  }
}
