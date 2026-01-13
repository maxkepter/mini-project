import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User.entity';
import { IRepository } from './IRepository';

@Injectable()
export class UserRepository implements IRepository<User> {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.repository.find({
      relations: ['studentExams'],
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.repository.findOne({
      where: { userId: id },
      relations: ['studentExams'],
    });
  }

  async isExistingUser(username: string): Promise<boolean> {
    const user = await this.repository.findOne({
      where: { username },
    });
    return user !== null && user !== undefined;
  }

  async findByUserName(username: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { username },
    });
  }

  async create(item: User): Promise<User> {
    const user = this.repository.create(item);
    return await this.repository.save(user);
  }

  async update(id: number, item: Partial<User>): Promise<User | null> {
    await this.repository.update(id, item);
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) {
      return false;
    }
    user.isActive = false;
    await this.repository.save(user);
    return true;
  }

  async exsits(id: number): Promise<boolean> {
    const count = await this.repository.count({ where: { userId: id } });
    return count > 0;
  }
}
