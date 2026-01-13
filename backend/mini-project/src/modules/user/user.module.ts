import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/entities';
import { UserRepository } from 'src/domain/repository';
import { AdminUserController } from './admin.user.controller';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AdminUserController, UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
