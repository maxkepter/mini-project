import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam, Question } from 'src/domain/entities';
import { ExamRepository, QuestionRepository } from 'src/domain/repository';
import { AdminExamController } from './admin-exam.controller';
import { UserExamController } from './user-exam.controller';
import { ExamService } from './exam.service';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, Question])],
  controllers: [AdminExamController, UserExamController],
  providers: [ExamService, ExamRepository, QuestionRepository],
  exports: [ExamService],
})
export class ExamModule {}
