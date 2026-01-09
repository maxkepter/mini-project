import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudentExamQuestion } from './StudentExamQuestion.entity';

@Entity('StudentExamAnswer')
export class StudentExamAnswer {
  @PrimaryGeneratedColumn({ name: 'studentExamAnswerId' })
  studentExamAnswerId: number;

  @Column({ type: 'varchar', length: 500 })
  content: string;

  @Column({ type: 'bit' })
  isCorrect: boolean;

  @Column({ type: 'bit', default: false })
  isSelected: boolean;

  @Column({ type: 'int', name: 'studentExamQuestionId' })
  studentExamQuestionId: number;

  @ManyToOne(
    () => StudentExamQuestion,
    (studentExamQuestion) => studentExamQuestion.studentExamAnswers,
  )
  @JoinColumn({ name: 'studentExamQuestionId' })
  studentExamQuestion: StudentExamQuestion;
}
