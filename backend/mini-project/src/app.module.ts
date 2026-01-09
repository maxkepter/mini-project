/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import { User } from './domain/entities/User.entity';
import { Exam } from './domain/entities/Exam.entity';
import { Question } from './domain/entities/Question.entity';
import { Option } from './domain/entities/Option.entity';
import { StudentExam } from './domain/entities/StudentExam.entity';
import { StudentExamQuestion } from './domain/entities/StudentExamQuestion.entity';
import { StudentExamAnswer } from './domain/entities/StudentExamAnswer.entity';
import { UserRepository } from './domain/repository/UserRepository';
import { ExamRepository } from './domain/repository/ExamRepository';
import { ExamService } from './service/exam.service';
import { QuestionRepository } from './domain/repository/QuestionRepository';
import { OptionRepository } from './domain/repository/OptionRepository';
import { StudentExamRepository } from './domain/repository/StudentExamRepository';
import { StudentExamQuestionRepository } from './domain/repository/StudentExamQuestionRepository';
import { StudentExamAnswerRepository } from './domain/repository/StudentExamAnswerRepository';
import { AuthController } from './controller/auth/auth.controller';
import { UserExamController } from './controller/exam/userExam.controller';
import { AdminExamController } from './controller/exam/admin.exam.controller';
import { AdminQuestionController } from './controller/exam/admin.question.controller';
import { StudentExamController } from './controller/exam/studentExam.controller';
import { AdminUserController } from './controller/user/admin.user.controller';
import { QuestionService } from './service/question.service';
import { StudentExamService } from './service/studentExam.service';
import { UserService } from './service/user.service';
import { AuthService } from './service/auth.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
      User,
      Exam,
      Question,
      Option,
      StudentExam,
      StudentExamQuestion,
      StudentExamAnswer,
    ]),
  ],
  controllers: [
    AppController,
    UserExamController,
    AuthController,
    AdminExamController,
    AdminQuestionController,
    StudentExamController,
    AdminUserController,
  ],
  providers: [
    AppService,
    ExamService,
    QuestionService,
    StudentExamService,
    UserService,
    AuthService,
    UserRepository,
    ExamRepository,
    QuestionRepository,
    OptionRepository,
    StudentExamRepository,
    StudentExamQuestionRepository,
    StudentExamAnswerRepository,
  ],
  exports: [
    ExamService,
    QuestionService,
    StudentExamService,
    UserService,
    AuthService,
  ],
})
export class AppModule {}
