import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

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
    this.logger.log(`findAll() start`);
    const promotionId = info.promotionId.replace(/^$/, '%');
    const startDate = info.startDate;
    const endDate = info.endDate;

    if (!startDate || !endDate) {
      throw new BadRequestException('startDate, endDate must be defined.');
    }

    try {
      const findData = await this.stPromotionBenefitDayRepository.createQueryBuilder()
        .select([
          'DATE_FORMAT(stat_time, "%Y-%m-%d") AS statTime', 'promotion_id AS promotionId',
          'current_count AS currentCount', 'last_count AS lastCount', 'benefit_count AS benefitCount',
          'is_first AS isFirst', 'title',
        ])
        .where('stat_time BETWEEN :startDate AND :endDate', { startDate, endDate })
        .andWhere('promotion_id LIKE (:promotionId)', { promotionId })
        .execute();

      const promotionIdGroup = findData.map(data => data.promotionId);
      const targetPromotionId = [...new Set(promotionIdGroup)];

      let result = [];
      targetPromotionId.forEach((id) => {
        const form = {
          title: findData.find((data) => data.promotionId === id).title,
          promotionId: id,
          users: [],
        };
        findData.forEach((data) => {
          if (data.promotionId === id) {
            form.users.push({ [data.statTime]: [parseInt(data.lastCount), parseInt(data.currentCount)] });
          }
        });
        result.push(form);
      });
      console.log(result);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getBenefitStatDownload() {
    this.logger.log('csv download start');
    try {
      const fields = ['title', 'promotionId', 'lastCount', 'currentCount', 'benefitCount'];
      const opts = { fields };
      const myData = await this.stPromotionBenefitDayRepository.find();
      const csv = parse(myData, opts);
      return csv;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}