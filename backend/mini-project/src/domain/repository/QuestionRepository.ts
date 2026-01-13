import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Question } from '../entities/Question.entity';
import { IRepository } from './IRepository';

@Injectable()
export class QuestionRepository implements IRepository<Question> {
  constructor(
    @InjectRepository(Question)
    private repository: Repository<Question>,
  ) {}

  async findAll(): Promise<Question[]> {
    return await this.repository.find({
      relations: ['options'],
    });
  }

  async findById(id: number): Promise<Question | null> {
    return await this.repository.findOne({
      where: { questionId: id },
      relations: ['options'],
    });
  }

  async findByIds(ids: number[]): Promise<Question[]> {
    return await this.repository.find({
      where: { questionId: In(ids) },
      relations: ['options'],
    });
  }

  async isExist(id: number[]): Promise<boolean> {
    const count = await this.repository
      .find({
        where: id.map((questionId) => ({ questionId })),
      })
      .then((questions) => questions.length);
    return count === id.length;
  }

  async create(item: Question): Promise<Question> {
    const question = this.repository.create(item);
    return await this.repository.save(question);
  }

  async update(id: number, item: Partial<Question>): Promise<Question | null> {
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }
    // Merge changes into existing entity
    Object.assign(existing, item);
    // Use save() instead of update() to handle relations
    return await this.repository.save(existing);
  }

  //soft delete
  async delete(id: number): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (result.affected ?? 0) > 0;
  }

  async exsits(id: number): Promise<boolean> {
    const count = await this.repository.count({ where: { questionId: id } });
    return count > 0;
  }
}
