/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Option } from '../entities/Option.entity';
import { IRepository } from './IRepository';

@Injectable()
export class OptionRepository implements IRepository<Option> {
  constructor(
    @InjectRepository(Option)
    private repository: Repository<Option>,
  ) {}

  async findAll(): Promise<Option[]> {
    return await this.repository.find({
      relations: ['question'],
    });
  }

  async findById(id: number): Promise<Option | null> {
    return await this.repository.findOne({
      where: { optionId: id },
      relations: ['question'],
    });
  }

  async create(item: Option): Promise<Option> {
    const option = this.repository.create(item);
    return await this.repository.save(option);
  }

  async update(id: number, item: Option): Promise<Option | null> {
    await this.repository.update(id, item);
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async exsits(id: number): Promise<boolean> {
    const count = await this.repository.count({ where: { optionId: id } });
    return count > 0;
  }
}
