import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Question } from './Question.entity';

@Entity('Option')
export class Option {
  @PrimaryGeneratedColumn({ name: 'optionId' })
  optionId: number;

  @Column({ type: 'varchar', length: 500 })
  content: string;

  @Column({ type: 'bit' })
  isCorrect: boolean;

  @Column({ type: 'int', name: 'questionId' })
  questionId: number;

  @ManyToOne(() => Question, (question) => question.options)
  @JoinColumn({ name: 'questionId' })
  question: Question;

  static create(content: string, isCorrect: boolean): Option {
    const option = new Option();
    option.content = content;
    option.isCorrect = isCorrect;
    return option;
  }
}
