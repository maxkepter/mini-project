/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentExamQuestion } from '../entities/StudentExamQuestion.entity';
import { IRepository } from './IRepository';

@Injectable()
export class StudentExamQuestionRepository implements IRepository<StudentExamQuestion> {
  constructor(
    @InjectRepository(StudentExamQuestion)
    private repository: Repository<StudentExamQuestion>,
  ) {}

  async findAll(): Promise<StudentExamQuestion[]> {
    return await this.repository.find({
      relations: ['studentExam', 'studentExamAnswers'],
    });
  }

  async findById(id: number): Promise<StudentExamQuestion | null> {
    return await this.repository.findOne({
      where: { studentExamQuestionId: id },
      relations: ['studentExam', 'studentExamAnswers'],
    });
  }

  async create(item: StudentExamQuestion): Promise<StudentExamQuestion> {
    const studentExamQuestion = this.repository.create(item);
    return await this.repository.save(studentExamQuestion);
  }

  async update(
    id: number,
    item: StudentExamQuestion,
  ): Promise<StudentExamQuestion | null> {
    await this.repository.update(id, item);
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async exsits(id: number): Promise<boolean> {
    const count = await this.repository.count({
      where: { studentExamQuestionId: id },
    });
    return count > 0;
  }
}
