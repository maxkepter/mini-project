import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
} from 'typeorm';
import { StudentExam } from './StudentExam.entity';
import { ExamStatus } from '../enum/ExamStatus.enum';
import { Question } from './Question.entity';

@Entity('Exam')
export class Exam {
  @PrimaryGeneratedColumn({ name: 'examId' })
  examId: number;

  @Column({ type: 'int' })
  status: ExamStatus;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int' })
  duration: number;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deltedAt: Date | null;

  @OneToMany(() => StudentExam, (studentExam) => studentExam.exam)
  studentExams: StudentExam[];

  @ManyToMany(() => Question, (question) => question.exams, { cascade: true })
  @JoinTable({
    name: 'ExamQuestion',
    joinColumn: { name: 'examId', referencedColumnName: 'examId' },
    inverseJoinColumn: {
      name: 'questionId',
      referencedColumnName: 'questionId',
    },
  })
  questions: Question[];

  static create(
    name: string,
    duration: number,
    status: ExamStatus,
    questions: Question[],
  ): Exam {
    const exam = new Exam();
    exam.name = name;
    exam.duration = duration;
    exam.status = status;
    exam.questions = questions;
    return exam;
  }
}
