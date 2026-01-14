import {
  ExamRepository,
  StudentExamRepository,
  UserRepository,
} from 'src/domain/repository';
import { StudentExamCreationRequest } from '../../service/dto/request/studentExamCreation.request';
import {
  Option,
  Question,
  StudentExam,
  StudentExamAnswer,
  StudentExamQuestion,
} from 'src/domain/entities';
import { shuffleArray } from 'src/utils/array.utils';
import { StudentExamStatus } from 'src/domain/enum';
import { StudentExamResponse } from '../../service/dto/response/studentExam.response';
import { StudentExamMapper } from '../../service/mapper/studentExam.mapper';
import { StudentExamSelectionRequest } from '../../service/dto/request/studentExamSelection.request';
import { Injectable } from '@nestjs/common';
import { StudentExamSummaryResponse } from './dtos.response';

@Injectable()
export class StudentExamService {
  constructor(
    private readonly examRepo: ExamRepository,
    private readonly userRepo: UserRepository,
    private readonly studentExanmRepo: StudentExamRepository,
  ) {}
  async createStudentExam(
    request: StudentExamCreationRequest,
  ): Promise<StudentExamResponse> {
    const exam = await this.examRepo.findById(request.examId);
    if (!exam) {
      throw new Error('Exam does not exist');
    }
    if (!(await this.userRepo.exsits(request.userId))) {
      throw new Error('User does not exist');
    }
    const questions = exam.questions;
    const studentExamQuestions = shuffleArray(
      questions.map((question) => this.convertToStudentExamQuestions(question)),
    );
    const studentExam = StudentExam.create(
      request.userId,
      exam.examId,
      StudentExamStatus.IN_PROGRESS,
      studentExamQuestions,
    );
    await this.studentExanmRepo.create(studentExam);
    return StudentExamMapper.toResponse(studentExam);
  }

  async takeExam(
    request: StudentExamCreationRequest,
  ): Promise<StudentExamResponse> {
    const inprogressExam = await this.getInprogressExam(request.userId);
    if (inprogressExam) {
      return StudentExamMapper.toResponse(inprogressExam, true);
    }
    return this.createStudentExam(request);
  }

  private async getInprogressExam(userId: number): Promise<StudentExam | null> {
    return await this.studentExanmRepo.findByUserAndStatus(
      userId,
      StudentExamStatus.IN_PROGRESS,
    );
  }

  async getStudentExamById(
    studentExamId: number,
    userId?: number,
    userRole?: number,
  ): Promise<StudentExamResponse | null> {
    const studentExam = await this.studentExanmRepo.findById(studentExamId);
    if (!studentExam) {
      return null;
    }
    // Admin có thể xem tất cả, student chỉ xem được bài thi của mình
    if (userRole !== 0 && studentExam.userId !== userId) {
      throw new Error('Unauthorized: You can only view your own exam');
    }
    return StudentExamMapper.toResponse(studentExam);
  }

  async getStudentExamByUserId(
    userId: number,
  ): Promise<StudentExamSummaryResponse[]> {
    const res = await this.studentExanmRepo.findByUserId(userId);
    return res;
  }

  async getStudentExamByExamId(
    examId: number,
  ): Promise<StudentExamSummaryResponse[]> {
    return await this.studentExanmRepo.findByExamId(examId);
  }

  async selectOptions(request: StudentExamSelectionRequest): Promise<void> {
    console.log('SelectOptions Request:', request);
    const studentExam = await this.studentExanmRepo.findById(
      request.studentExamId,
    );
    if (!studentExam) {
      throw new Error('Student exam does not exist');
    }

    studentExam.updateSelectedOptions(request.selections);
    await this.studentExanmRepo.update(studentExam.studentExamId, studentExam);
  }

  async submitExam(studentExamId: number): Promise<StudentExamResponse> {
    const studentExam = await this.studentExanmRepo.findById(studentExamId);
    if (!studentExam) {
      throw new Error('Student exam does not exist');
    }

    studentExam.submit();
    await this.studentExanmRepo.update(studentExam.studentExamId, studentExam);
    return StudentExamMapper.toResponse(studentExam);
  }

  async getAllStudentExams(): Promise<StudentExam[]> {
    return await this.studentExanmRepo.findAll();
  }

  private convertToStudentExamQuestions(
    question: Question,
  ): StudentExamQuestion {
    const studentExamQuestion = new StudentExamQuestion();
    studentExamQuestion.content = question.content;
    studentExamQuestion.studentExamAnswers = question.options.map((option) =>
      this.convertToStudentExamAnsewers(option),
    );
    return studentExamQuestion;
  }
  private convertToStudentExamAnsewers(option: Option): StudentExamAnswer {
    const studentExamAnswer = new StudentExamAnswer();
    studentExamAnswer.content = option.content;
    studentExamAnswer.isCorrect = option.isCorrect;
    studentExamAnswer.isSelected = false;
    return studentExamAnswer;
  }
}
