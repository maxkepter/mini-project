import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { StudentExam } from './StudentExam.entity';
import { UserRole } from '../enum/UserRole.enum';

@Entity('[User]')
export class User {
  @PrimaryGeneratedColumn({ name: 'userId' })
  userId: number;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'username' })
  username: string;

  @Column({ type: 'varchar', length: 255, name: 'password' })
  password: string;

  @Column({ type: 'int' })
  role: UserRole;

  @Column({ type: 'bit', default: true })
  isActive: boolean;

  @OneToMany(() => StudentExam, (studentExam) => studentExam.user)
  studentExams: StudentExam[];
}
