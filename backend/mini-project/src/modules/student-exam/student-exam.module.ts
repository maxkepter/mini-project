import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  StudentExam,
  StudentExamQuestion,
  StudentExamAnswer,
  Exam,
  User,
} from 'src/domain/entities';
import {
  StudentExamRepository,
  StudentExamQuestionRepository,
  StudentExamAnswerRepository,
  ExamRepository,
  UserRepository,
} from 'src/domain/repository';
import { StudentExamController } from './student-exam.controller';
import { StudentExamService } from './student-exam.service';
import { AdminStudentExamController } from './admin.student-exam.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentExam,
      StudentExamQuestion,
      StudentExamAnswer,
      Exam,
      User,
    ]),
  ],
  controllers: [StudentExamController, AdminStudentExamController],
  providers: [
    StudentExamService,
    StudentExamRepository,
    StudentExamQuestionRepository,
    StudentExamAnswerRepository,
    ExamRepository,
    UserRepository,
  ],
  exports: [StudentExamService],
})
export class StudentExamModule {}
