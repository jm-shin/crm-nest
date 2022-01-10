import { AbstractRepository, EntityRepository } from 'typeorm';
import { stPromotionBenefitDay } from '../stPromotionBenefitDay.entity';


@EntityRepository(stPromotionBenefitDay)
export class StPromotionBenefitDayRepository extends AbstractRepository<stPromotionBenefitDay> {
  find() {
    return this.repository.find();
  }
}