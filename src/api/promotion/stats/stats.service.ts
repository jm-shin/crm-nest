import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { stPromotionBenefitDay } from '../../../entities/stPromotionBenefitDay.entity';
import { Repository } from 'typeorm';
import { ormConfig } from '../../../config/ormconfig';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(stPromotionBenefitDay, 'stats')
    private readonly StPromotionBenefitDayRepository: Repository<stPromotionBenefitDay>
  ) {
  }

  async find() {
    console.log(ormConfig[0]);
    return this.StPromotionBenefitDayRepository.find();
  }
}
