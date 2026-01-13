import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { StudentExam } from '../entities/StudentExam.entity';
import { IRepository } from './IRepository';
import { StudentExamSummaryResponse } from 'src/service/dto/response/studentExamSumary.response';

@Injectable()
export class StudentExamRepository implements IRepository<StudentExam> {
  constructor(
    @InjectRepository(StudentExam)
    private repository: Repository<StudentExam>,
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
      relations: ['user', 'exam', 'studentExamQuestions'],
    });
  }

  async findByUserId(userId: number): Promise<StudentExamSummaryResponse[]> {
    return await this.dataSource.query(
      'EXEC sp_get_exam_history @UserId = @0',
      [userId],
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
    await this.repository.update(id, item);
    return await this.findById(id);
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
