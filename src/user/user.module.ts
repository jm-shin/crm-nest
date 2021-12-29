import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';

@Module({
    imports: [
      TypeOrmModule.forFeature([User, UserRepository]),
    ],
    exports: [TypeOrmModule, UserService],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule { }
