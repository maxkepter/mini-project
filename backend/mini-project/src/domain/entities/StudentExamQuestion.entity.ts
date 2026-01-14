import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { StudentExam } from './StudentExam.entity';
import { StudentExamAnswer } from './StudentExamAnswer.entity';

@Entity('StudentExamQuestion')
export class StudentExamQuestion {
  @PrimaryGeneratedColumn({ name: 'studentExamQuestionId' })
  studentExamQuestionId: number;

  @Column({ type: 'varchar', length: 1000 })
  content: string;

  @Column({ type: 'int', name: 'studentExamId' })
  studentExamId: number;

  @ManyToOne(
    () => StudentExam,
    (studentExam) => studentExam.studentExamQuestions,
  )
  @JoinColumn({ name: 'studentExamId' })
  studentExam: StudentExam;

  @OneToMany(
    () => StudentExamAnswer,
    (studentExamAnswer) => studentExamAnswer.studentExamQuestion,
    { cascade: true },
  )
  studentExamAnswers: StudentExamAnswer[];

  isQuestionCorrect(): boolean {
    for (const answer of this.studentExamAnswers) {
      if (answer.isCorrect !== answer.isSelected) {
        return false;
      }
    }
    return true;
  }
}
