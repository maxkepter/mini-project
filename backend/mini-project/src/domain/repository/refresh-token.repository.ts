import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token';
import { IRepository } from './IRepository';

@Injectable()
export class RefreshTokenRepository implements IRepository<RefreshToken> {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repository: Repository<RefreshToken>,
  ) {}

  async findAll(): Promise<RefreshToken[]> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<RefreshToken | null> {
    return await this.repository.findOne({ where: { tokenId: id } });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return await this.repository.findOne({
      where: { token },
      relations: ['user'],
    });
  }

  async create(item: RefreshToken): Promise<RefreshToken> {
    const entity = this.repository.create(item);
    return await this.repository.save(entity);
  }

  async update(id: number, item: RefreshToken): Promise<RefreshToken | null> {
    await this.repository.update(id, item);
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async exsits(id: number): Promise<boolean> {
    const count = await this.repository.count({ where: { tokenId: id } });
    return count > 0;
  }

  async revokeByToken(token: string): Promise<boolean> {
    const entity = await this.findByToken(token);
    if (!entity) {
      return false;
    }
    entity.isRevoked = true;
    entity.revokedDate = new Date();
    await this.repository.save(entity);
    return true;
  }

  async revokeByUserId(userId: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder()
      .update(RefreshToken)
      .set({ isRevoked: true, revokedDate: new Date() })
      .where('userId = :userId AND isRevoked = false', { userId })
      .execute();
    return result.affected ?? 0;
  }
}
