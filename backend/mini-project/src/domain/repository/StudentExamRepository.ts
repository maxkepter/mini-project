import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { StudentExam } from '../entities/StudentExam.entity';
import { IRepository } from './IRepository';
import { StudentExamSummaryResponse } from 'src/modules/student-exam/dtos.response';

@Injectable()
export class StudentExamRepository implements IRepository<StudentExam> {
  constructor(
    @InjectRepository(StudentExam)
    private readonly repository: Repository<StudentExam>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<StudentExam[]> {
    return await this.repository.find({
      relations: ['user', 'exam', 'studentExamQuestions'],
    });
  }

  async findById(id: number): Promise<StudentExam | null> {
    return await this.repository.findOne({
      where: { studentExamId: id },
      relations: [
        'user',
        'exam',
        'exam.questions',
        'exam.questions.options',
        'studentExamQuestions',
        'studentExamQuestions.studentExamAnswers',
      ],
    });
  }

  async findByUserAndStatus(
    userId: number,
    status: number,
  ): Promise<StudentExam | null> {
    return await this.repository.findOne({
      where: { userId: userId, status: status },
      relations: [
        'user',
        'exam',
        'exam.questions',
        'exam.questions.options',
        'studentExamQuestions',
        'studentExamQuestions.studentExamAnswers',
      ],
    });
  }

  async findByUserId(userId: number): Promise<StudentExamSummaryResponse[]> {
    return await this.dataSource.query(
      'EXEC dbo.sp_get_student_exams_by_user @userId = @0',
      [userId],
    );
  }
  async findByExamId(examId: number): Promise<StudentExamSummaryResponse[]> {
    return await this.dataSource.query(
      'EXEC dbo.sp_get_student_exams_by_exam @examId = @0',
      [examId],
    );
  }

  async create(item: StudentExam): Promise<StudentExam> {
    const studentExam = this.repository.create(item);
    return await this.repository.save(studentExam);
  }

  async update(
    id: number,
    item: Partial<StudentExam>,
  ): Promise<StudentExam | null> {
    const existingStudentExam = await this.findById(id);
    if (!existingStudentExam) {
      return null;
    }

    Object.assign(existingStudentExam, {
      ...item,
      studentExamId: id,
    });

    if (item.studentExamQuestions) {
      existingStudentExam.studentExamQuestions = item.studentExamQuestions;
    }

    console.log('Updating StudentExam:', existingStudentExam);

    return await this.repository.save(existingStudentExam);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async exsits(id: number): Promise<boolean> {
    const count = await this.repository.count({ where: { studentExamId: id } });
    return count > 0;
  }
}
