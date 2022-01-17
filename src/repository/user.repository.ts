import { AbstractRepository, EntityRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Logger } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {

  private readonly logger = new Logger(UserRepository.name);
  private readonly department = ['개발팀', '프로모션 설계팀', '프로모션 관리팀'];

  public async findAll() {
    const qb = this.repository
      .createQueryBuilder('User')
      .select(['User.idx', 'User.userId', 'User.userName']);

    qb.andWhere('User.department IN (:dept)', { dept: this.department })
      .orderBy('User.idx');

    return qb.getMany();
  }
}