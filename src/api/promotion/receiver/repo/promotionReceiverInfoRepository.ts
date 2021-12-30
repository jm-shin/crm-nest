import { AbstractRepository, EntityRepository, getRepository } from 'typeorm';
import { PromotionReceiverInfo } from '../entities/promotionReceiverInfo.entity';
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
        'receiverInfo.receiverId AS receiverId', 'receiverInfo.title AS title', 'user.userName AS registrant',
        'date_format(receiverInfo.createdAt, "%Y-%m-%d %T") AS createdAt',
      ])
      .andWhere(`receiverInfo.title LIKE (:title)`, { title })
      .andWhere(`user.userName LIKE (:registrant)`, { registrant });

    return qb.getRawMany();
  }

  public async getOne(id) {
    const qb = this.repository
      .createQueryBuilder('receiverInfo')
      .leftJoinAndSelect('receiverInfo.User', 'user')
      .select([
        //receiverInfo
        'receiverInfo.receiverId AS receiverId', 'receiverInfo.title AS title', 'receiverInfo.description AS description',
        'receiverInfo.conditionText AS conditionText',
        //'date_format(r.updatedAt, "%Y-%m-%d %T") AS updatedAt', 'date_format(r.createdAt, "%Y-%m-%d %T") AS createdAt',

        //user
        'user.userName AS registrant', 'user.department AS department', 'user.email AS email',
      ])
      .andWhere('receiverInfo.receiverId = :id', { id });

    return qb.getRawOne();
  }

  public async delete(ids) {
    const qb = this.repository
      .createQueryBuilder()
      .delete()
      .where('receiver_id IN (:ids)', { ids });

    return qb.execute();
  }

}