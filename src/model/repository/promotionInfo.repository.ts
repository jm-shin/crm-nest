import { AbstractRepository, EntityRepository } from 'typeorm';
import { PromotionInfo } from '../entities/promotionInfo.entity';

@EntityRepository(PromotionInfo)
export class PromotionInfoRepository extends AbstractRepository<PromotionInfo> {

  save(data) {
    return this.repository.save(data);
  }

  updateValidState(ids) {
    const qb = this.repository
      .createQueryBuilder()
      .update()
      .set({ validState: 0 })
      .where('idx IN (:ids)', { ids });

    return qb.execute();
  }

  getAll(findOpt) {
    const { title, description, registrant, promotionId } = findOpt;
    const qb = this.repository
      .createQueryBuilder('promotion')
      .leftJoinAndSelect('promotion.User', 'user')
      .select([
        'promotion.idx AS idx', 'promotion.title AS name', 'promotion.description AS description',
        'promotion.promotionId AS promotionId', 'DATE_FORMAT(promotion.createdAt, "%Y-%m-%d %T") AS createdAt',
        'user.userName AS registrant',
      ])
      .where('promotion.validState = 1')
      .andWhere('promotion.title LIKE (:title)', { title })
      .andWhere('promotion.description LIKE (:description)', { description })
      .andWhere('promotion.promotionId LIKE (:promotionId)', { promotionId })
      .andWhere('user.userName LIKE (:registrant)', { registrant })
      .orderBy('promotion.idx');

    return qb.getRawMany();
  }

  getOne(idx) {
    const qb = this.repository
      .createQueryBuilder('promotion')
      .leftJoinAndSelect('promotion.User', 'user')
      .select([
        'promotion.idx AS idx', 'promotion.title AS title', 'promotion.description AS description',
        'user.userName AS registrant', 'user.email AS email',
        'promotion.promotionId AS promotionId', 'promotion.groupNo AS groupNo', 'promotion.receiverId AS receiverId',
        'promotion.conditionJson AS conditionJson',
        'promotion.progressState AS progressState', 'DATE_FORMAT(promotion.createdAt, "%Y-%m-%d %T") AS createdAt',
      ])
      .where('promotion.validState = 1')
      .andWhere('promotion.idx = :idx', { idx });
    return qb.getRawOne();
  }

  update(data) {
    const qb = this.repository
      .createQueryBuilder()
      .update()
      .set(data)
      .where('promotionId = :promotionId', { promotionId: data.promotionId });
    return qb.execute();
  }
}