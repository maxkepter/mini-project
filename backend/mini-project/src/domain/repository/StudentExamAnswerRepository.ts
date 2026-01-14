import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { StudentExamAnswer } from '../entities/StudentExamAnswer.entity';
import { IRepository } from './IRepository';

@Injectable()
export class StudentExamAnswerRepository implements IRepository<StudentExamAnswer> {
  constructor(
    @InjectRepository(StudentExamAnswer)
    private repository: Repository<StudentExamAnswer>,
  ) {}

  async findAll(): Promise<StudentExamAnswer[]> {
    return await this.repository.find({
      relations: ['studentExamQuestion'],
    });
  }

  async findById(id: number): Promise<StudentExamAnswer | null> {
    return await this.repository.findOne({
      where: { studentExamAnswerId: id },
      relations: ['studentExamQuestion'],
    });
  }

  async findByIds(ids: number[]): Promise<StudentExamAnswer[]> {
    return await this.repository.find({
      where: { studentExamAnswerId: In(ids) },
      relations: ['studentExamQuestion'],
    });
  }

  async create(item: StudentExamAnswer): Promise<StudentExamAnswer> {
    const studentExamAnswer = this.repository.create(item);
    return await this.repository.save(studentExamAnswer);
  }

  async update(
    id: number,
    item: Partial<StudentExamAnswer>,
  ): Promise<StudentExamAnswer | null> {
    await this.repository.update(id, item);
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async exsits(id: number): Promise<boolean> {
    const count = await this.repository.count({
      where: { studentExamAnswerId: id },
    });
    return count > 0;
  }
}
