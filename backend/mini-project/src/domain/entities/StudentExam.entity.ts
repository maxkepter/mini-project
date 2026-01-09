import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './User.entity';
import { Exam } from './Exam.entity';
import { StudentExamQuestion } from './StudentExamQuestion.entity';
import { StudentExamStatus } from '../enum/StudentExamStatus.enum';

@Entity('StudentExam')
export class StudentExam {
  @PrimaryGeneratedColumn({ name: 'studentExamId' })
  studentExamId: number;

  @Column({ type: 'int' })
  status: StudentExamStatus;

  @Column({ type: 'datetime2', name: 'startTime' })
  startTime: Date;

  @Column({ type: 'datetime2', name: 'submitTime', nullable: true })
  submitTime: Date | null;

  @Column({ type: 'float' })
  score: number;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @Column({ type: 'int', name: 'examId' })
  examId: number;

  @ManyToOne(() => User, (user) => user.studentExams)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Exam, (exam) => exam.studentExams)
  @JoinColumn({ name: 'examId' })
  exam: Exam;

  @OneToMany(
    () => StudentExamQuestion,
    (studentExamQuestion) => studentExamQuestion.studentExam,
    { cascade: true },
  )
  studentExamQuestions: StudentExamQuestion[];

  static create(
    userId: number,
    examId: number,
    status: StudentExamStatus,
    studentExamQuestions: StudentExamQuestion[],
  ): StudentExam {
    const studentExam = new StudentExam();
    studentExam.userId = userId;
    studentExam.examId = examId;
    studentExam.status = status;
    studentExam.startTime = new Date();
    studentExam.submitTime = null;
    studentExam.score = 0;
    studentExam.studentExamQuestions = studentExamQuestions;
    return studentExam;
  }
}
