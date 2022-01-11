import { AbstractRepository, EntityRepository } from 'typeorm';
import { PromotionReceiverInfo } from '../promotionReceiverInfo.entity';
import { Logger } from '@nestjs/common';

export interface PromotionFindOption {
  title?: string,
  registrant?: string,
}

@EntityRepository(PromotionReceiverInfo)
export class PromotionReceiverInfoRepository extends AbstractRepository<PromotionReceiverInfo> {

  private readonly logger = new Logger(PromotionReceiverInfoRepository.name);

  public save(data) {
    return this.repository.save(data);
  }

  public update(id, data) {
    return this.repository.update(id, data);
  }

  public async getAll({ title, registrant }: PromotionFindOption = {}) {
    const qb = this.repository
      .createQueryBuilder('receiverInfo')
      .leftJoinAndSelect('receiverInfo.User', 'user')
      .select([
        'receiverInfo.receiverId AS idx', 'receiverInfo.title AS title', 'user.userName AS registrant',
        'receiverInfo.groupNo AS groupNo', 'date_format(receiverInfo.createdAt, "%Y-%m-%d %T") AS createdAt',
      ])
      .andWhere('receiverInfo.validState = 1')
      .andWhere(`receiverInfo.title LIKE (:title)`, { title })
      .andWhere(`user.userName LIKE (:registrant)`, { registrant })

    return qb.getRawMany();
  }

  public async getOne(id) {
    const qb = this.repository
      .createQueryBuilder('receiverInfo')
      .leftJoinAndSelect('receiverInfo.User', 'user')
      .select([
        //receiverInfo
        'receiverInfo.receiverId AS idx', 'receiverInfo.title AS title', 'receiverInfo.description AS description',
        'receiverInfo.groupNo AS groupNo', 'receiverInfo.conditionText AS conditionText', 'receiverInfo.conditionJson AS conditionJson',
        //'date_format(r.updatedAt, "%Y-%m-%d %T") AS updatedAt', 'date_format(r.createdAt, "%Y-%m-%d %T") AS createdAt',

        //user
        'user.userName AS registrant', 'user.department AS department', 'user.email AS email',
      ])
      .andWhere('receiverInfo.validState = 1')
      .andWhere('receiverInfo.receiverId = :id', { id });

    return qb.getRawOne();
  }

  /* 삭제 > 상태업데이트로 변경
  public async delete(ids) {
    const qb = this.repository
      .createQueryBuilder()
      .delete()
      .where('receiver_id IN (:ids)', { ids });

    return qb.execute();
  }
  */

  public async updateValidState(ids) {
    const qb = this.repository
      .createQueryBuilder()
      .update()
      .set({ validState: 0 })
      .where('receiver_id IN (:ids)', { ids });

    return qb.execute();
  }
}