import { Injectable, Logger } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { stPromotionBenefitDay } from '../../../model/entities/external/stPromotionBenefitDay.entity';
import { Repository } from 'typeorm';
import { parse } from 'json2csv';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(stPromotionBenefitDay, 'stats')
    private readonly stPromotionBenefitDayRepository: Repository<stPromotionBenefitDay>
  ) {
  }

  private readonly logger: Logger = new Logger(StatsService.name);

  async find() {
    return this.stPromotionBenefitDayRepository.find();
  }

  async getBenefitStatDownload () {
    try {
      const fields = ['promotion_id', 'benefit_count', 'current_count'];
      const opts = { fields };
      const myData = await this.stPromotionBenefitDayRepository.find();
      const csv = parse(myData, opts);
      this.logger.log(csv);
    }catch (error) {
      this.logger.error(error);
    }
  }
}
