import { AbstractRepository, EntityRepository } from 'typeorm';
import { PromotionInfo } from '../entities/promotionInfo.entity';

@EntityRepository(PromotionInfo)
export class PromotionInfoRepository extends AbstractRepository<PromotionInfo> {

  save(data) {
    return this.repository.save(data);
  }

}