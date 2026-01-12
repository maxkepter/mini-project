import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity({ name: 'RefreshToken' })
export class RefreshToken {
  @PrimaryGeneratedColumn()
  tokenId: number;
  @Column({ type: 'varchar', length: 255 })
  token: string;
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
  @Column({ type: 'datetime' })
  expiredAt: Date;
  @Column({ type: 'bit' })
  isExpired: boolean;
  @Column({ type: 'datetime', nullable: true })
  revokedDate: Date | null;
  @Column({ type: 'bit' })
  isRevoked: boolean;
  @Column({ type: 'int' })
  userId: number;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  static create(token: string, expiredAt: Date, userId: number) {
    const refreshToken = new RefreshToken();
    refreshToken.token = token;
    refreshToken.expiredAt = expiredAt;
    refreshToken.isExpired = false;
    refreshToken.isRevoked = false;
    refreshToken.userId = userId;
    return refreshToken;
  }

  revoke() {
    this.isRevoked = true;
    this.revokedDate = new Date();
  }

  isTokenValid(): boolean {
    return !this.isExpiredToken() && !this.isRevoked;
  }
  isExpiredToken(): boolean {
    const now = new Date();
    this.isExpired = now >= this.expiredAt;
    return this.isExpired;
  }
}
