import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserRepository } from '../../repository/user.repository';
import { User } from '../../entities/user.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([User, UserRepository]),
    ],
    exports: [TypeOrmModule, UserService],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule { }
