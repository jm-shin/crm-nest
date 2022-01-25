import { AbstractRepository, EntityRepository } from 'typeorm';
import { StPromotionBenefitDay } from '../../entities/external/stPromotionBenefitDay.entity';


@EntityRepository(StPromotionBenefitDay)
export class StPromotionBenefitDayRepository extends AbstractRepository<StPromotionBenefitDay> {
  find() {
    return this.repository.find();
  }
}