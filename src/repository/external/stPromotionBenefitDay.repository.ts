import { AbstractRepository, EntityRepository } from 'typeorm';
import { stPromotionBenefitDay } from '../../entities/external/stPromotionBenefitDay.entity';


@EntityRepository(stPromotionBenefitDay)
export class StPromotionBenefitDayRepository extends AbstractRepository<stPromotionBenefitDay> {
  find() {
    return this.repository.find();
  }
}