import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  DeleteDateColumn,
} from 'typeorm';
import { Option } from './Option.entity';
import { Exam } from './Exam.entity';

@Entity('Question')
export class Question {
  @PrimaryGeneratedColumn({ name: 'questionId' })
  questionId: number;

  @Column({ type: 'varchar', length: 1000 })
  content: string;

  @OneToMany(() => Option, (option) => option.question)
  options: Option[];

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deleteDate: Date | null;

  @ManyToMany(() => Exam, (exam) => exam.questions)
  exams: Exam[];
  static create(content: string, options: Option[]): Question {
    const question = new Question();
    question.content = content;
    question.options = options;
    return question;
  }
}
