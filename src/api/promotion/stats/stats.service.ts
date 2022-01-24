import { Injectable, Logger } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { stPromotionBenefitDay } from '../../../model/entities/external/stPromotionBenefitDay.entity';
import { Repository } from 'typeorm';
import { parse } from 'json2csv';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(stPromotionBenefitDay, 'stats')
    private readonly stPromotionBenefitDayRepository: Repository<stPromotionBenefitDay>,
  ) {
  }

  private readonly logger: Logger = new Logger(StatsService.name);

  async findAll(info) {
    const promotionId = info.promotionId.replace(/^$/, '%');
    const targetDate = info.targetDate;
    
    return this.stPromotionBenefitDayRepository.createQueryBuilder()
      .select([
        'DATE_FORMAT(stat_time, "%Y-%m-%d %T") AS statTime', 'promotion_id AS promotionId',
        'current_count AS currentCount', 'last_count AS lastCount', 'benefit_count AS benefitCount',
        'is_first AS isFirst',
      ])
      .where('stat_time BETWEEN DATE_ADD(:targetDate, INTERVAL -10 DAY) AND :targetDate', { targetDate })
      .andWhere('promotion_id LIKE (:promotionId)', { promotionId })
      .execute();
  }

  async getBenefitStatDownload() {
    try {
      const fields = ['promotion_id', 'benefit_count', 'current_count'];
      const opts = { fields };
      const myData = await this.stPromotionBenefitDayRepository.find();
      const csv = parse(myData, opts);
      this.logger.log(csv);
      //return csv;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
