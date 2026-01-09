import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../domain/entities/User.entity';
import { Exam } from '../domain/entities/Exam.entity';
import { Question } from '../domain/entities/Question.entity';
import { Option } from '../domain/entities/Option.entity';
import { StudentExam } from '../domain/entities/StudentExam.entity';
import { StudentExamQuestion } from '../domain/entities/StudentExamQuestion.entity';
import { StudentExamAnswer } from '../domain/entities/StudentExamAnswer.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  username: process.env.DB_USERNAME || 'sa',
  password: process.env.DB_PASSWORD || 'sa',
  database: process.env.DB_NAME || 'mini_project',
  entities: [
    User,
    Exam,
    Question,
    Option,
    StudentExam,
    StudentExamQuestion,
    StudentExamAnswer,
  ],
  synchronize: process.env.NODE_ENV !== 'production',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};
