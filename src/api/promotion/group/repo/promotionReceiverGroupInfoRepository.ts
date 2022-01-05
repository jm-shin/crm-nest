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
      .select(['group.groupId AS idx', 'group.title AS title', 'group.groupNo AS groupNo',
        'date_format(group.createdAt, "%Y-%m-%d %T") AS createdAt', 'user.userName AS registrant',
      ])
      .andWhere('group.title LIKE (:title)', { title })
      .andWhere('user.userName LIKE (:registrant)', { registrant })
      .andWhere('group.validState = 1');
    return qb.execute();
  }

  findOne(id) {
    const qb = this.repository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.User', 'user')
      .select(['group.groupId AS idx','group.title AS title', 'group.unoCount AS unoCount', 'group.groupNo AS groupNo',
        'user.userName AS registrant', 'user.email AS email', 'user.department AS department',
        'DATE_FORMAT(group.updatedAt, "%Y-%m-%d %T") AS updatedAt',
      ])
      .andWhere('group.groupId = :id', { id });
    return qb.getRawOne();
  }

  updateValidState(ids) {
    const qb = this.repository
      .createQueryBuilder()
      .update()
      .set({ validState: 0 })
      .where('groupId IN (:ids)', { ids });

    return qb.execute();
  }

  findUnoList(idx) {
    const qb = this.repository
      .createQueryBuilder('group')
      .select(['group.unoList'])
      .where('group.groupId = :idx', { idx });

    return qb.getOne();
  }
}