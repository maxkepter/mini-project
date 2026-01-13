import {
  ExamRepository,
  StudentExamAnswerRepository,
  StudentExamQuestionRepository,
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
import { SelectOptionRequest } from '../../service/dto/request/selectOption.request';
import { StudentExamSelectionRequest } from '../../service/dto/request/studentExamSelection.request';
import { Injectable } from '@nestjs/common';
import { StudentExamSummaryResponse } from './dtos.response';

@Injectable()
export class StudentExamService {
  constructor(
    private readonly examRepo: ExamRepository,
    private readonly userRepo: UserRepository,
    private readonly studentExanmRepo: StudentExamRepository,
    private readonly studentExamQuestionRepo: StudentExamQuestionRepository,
    private readonly studentExamAnswerRepo: StudentExamAnswerRepository,
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

  async getStudentExamById(
    studentExamId: number,
  ): Promise<StudentExamResponse | null> {
    const studentExam = await this.studentExanmRepo.findById(studentExamId);
    if (!studentExam) {
      return null;
    }
    return StudentExamMapper.toResponse(studentExam);
  }

  async getStudentExamByUserId(
    userId: number,
  ): Promise<StudentExamSummaryResponse[]> {
    return await this.studentExanmRepo.findByUserId(userId);
  }

  async getStudentExamByExamId(
    examId: number,
  ): Promise<StudentExamSummaryResponse[]> {
    return await this.studentExanmRepo.findByExamId(examId);
  }

  async selectOption(request: SelectOptionRequest): Promise<void> {
    const answer = await this.studentExamAnswerRepo.findById(request.optionId);
    if (!answer) {
      throw new Error('Student exam answer does not exist');
    }
    await this.studentExamAnswerRepo.update(answer.studentExamAnswerId, {
      ...answer,
      isSelected: request.isSelected,
    });
  }

  async selectOptions(request: StudentExamSelectionRequest): Promise<void> {
    const studentExam = await this.studentExanmRepo.findById(
      request.studentExamId,
    );
    if (!studentExam) {
      throw new Error('Student exam does not exist');
    }

    for (const selection of request.selections) {
      const answer = await this.studentExamAnswerRepo.findById(
        selection.studentExamAnswerId,
      );
      if (!answer) {
        throw new Error(
          `Student exam answer ${selection.studentExamAnswerId} does not exist`,
        );
      }

      await this.studentExamAnswerRepo.update(answer.studentExamAnswerId, {
        ...answer,
        isSelected: selection.isSelected,
      });
    }
  }

  async submitExam(studentExamId: number): Promise<StudentExamResponse> {
    const studentExam = await this.studentExanmRepo.findById(studentExamId);
    if (!studentExam) {
      throw new Error('Student exam does not exist');
    }
    const score = this.calculateScore(studentExam);

    studentExam.score = score;
    studentExam.status = StudentExamStatus.SUBMITTED;
    studentExam.submitTime = new Date();
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

  private calculateScore(studentExam: StudentExam): number {
    const totalQuestions = studentExam.studentExamQuestions.length;
    let correctAnswers = 0;
    for (const question of studentExam.studentExamQuestions) {
      if (question.isQuestionCorrect()) {
        correctAnswers++;
      }
    }
    return (correctAnswers / totalQuestions) * 100;
  }
}
