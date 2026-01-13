import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Exam } from '../entities/Exam.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IRepository } from './IRepository';
import { ExamSummaryResponse } from 'src/service/dto/response/examSumary.respone';

@Injectable()
export class ExamRepository implements IRepository<Exam> {
  constructor(
    @InjectRepository(Exam)
    private repository: Repository<Exam>,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<Exam[]> {
    return await this.repository.find({
      relations: [
        'studentExams',
        'questionExams',
        'questions',
        'questions.options',
      ],
    });
  }

  async findById(id: number): Promise<Exam | null> {
    return await this.repository.findOne({
      where: { examId: id },
      relations: ['studentExams', 'questions', 'questions.options'],
    });
  }

  async create(item: Exam): Promise<Exam> {
    const exam = this.repository.create(item);
    return await this.repository.save(exam);
  }

  async update(id: number, item: Partial<Exam>): Promise<Exam | null> {
    await this.repository.update(id, item);
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async exsits(id: number): Promise<boolean> {
    const count = await this.repository.count({ where: { examId: id } });
    return count > 0;
  }

  async getAllExams(): Promise<ExamSummaryResponse[]> {
    return await this.dataSource.query('EXEC sp_get_all_exams');
  }
}
