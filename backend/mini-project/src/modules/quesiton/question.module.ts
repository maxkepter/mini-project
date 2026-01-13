import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question, Option } from 'src/domain/entities';
import { QuestionRepository, OptionRepository } from 'src/domain/repository';
import { AdminQuestionController } from './admin.question.controller';
import { QuestionService } from './question.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Option])],
  controllers: [AdminQuestionController],
  providers: [QuestionService, QuestionRepository, OptionRepository],
  exports: [QuestionService],
})
export class QuestionModule {}
