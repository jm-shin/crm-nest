import { AbstractRepository, EntityRepository } from 'typeorm';
import { PromotionReceiverGroupInfo } from '../entities/promotionReceiverGroupInfo.entity';

@EntityRepository(PromotionReceiverGroupInfo)
export class PromotionReceiverGroupInfoRepository extends AbstractRepository<PromotionReceiverGroupInfo> {

  public save(data) {
    return this.repository.save(data);
  }

  public find(findOpt) {
    const { title, registrant } = findOpt;
    const qb = this.repository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.User', 'user')
      .select(['group.groupId AS groupId', 'group.title AS title', 'group.groupNo AS groupNo',
        'date_format(group.createdAt, "%Y-%m-%d %T") AS createdAt', 'user.userName AS registrant',
      ])
      .andWhere('group.title LIKE (:title)', { title })
      .andWhere('user.userName LIKE (:registrant)', { registrant });
    return qb.execute();
  }
}