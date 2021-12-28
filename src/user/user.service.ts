import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { getRepository, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
      private userRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger(UserService.name);
  private readonly department = ['개발팀', '프로모션 설계팀', '프로모션 관리팀'];

  async findAll(): Promise<User[]> {
    const users = await getRepository(User).createQueryBuilder('u')
      .select(['u.idx', 'u.userId', 'u.userName'])
      .where('u.department IN (:dept)', {dept: this.department})
      .orderBy('u.idx')
      .getMany();
    this.logger.log(`user list: ${JSON.stringify(users)}`);
    return users;
  }

  // async findOne(userId: string): Promise<User> {
  //   const user = await this.userRepository.findOne({where: {userId}})
  //   this.logger.log(`user info: ${JSON.stringify(user)}`);
  //   return user;
  // }
}