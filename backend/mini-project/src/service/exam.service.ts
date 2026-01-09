import { Injectable } from '@nestjs/common';
import { ExamRepository, QuestionRepository } from 'src/domain/repository';
import { CreateExamRequest } from './dto/request/createExam.request';
import { Exam } from 'src/domain/entities';
import { ExamStatus } from 'src/domain/enum';
import { ExamResponse } from './dto/response/exam.respone';
import { ExamMapper } from './mapper/exam.mapper';
import { ExamSummaryResponse } from './dto/response/examSumary.respone';

@Injectable()
export class ExamService {
  constructor(
    private readonly examRepo: ExamRepository,
    private readonly questionRepo: QuestionRepository,
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
  async getAllExams(): Promise<ExamSummaryResponse[]> {
    return await this.examRepo.getAllExams();
  }
}
