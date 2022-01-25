import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { StPromotionBenefitDay } from '../../../model/entities/external/stPromotionBenefitDay.entity';
import { Repository } from 'typeorm';
import { parse } from 'json2csv';
import { StPromotionMaintainMon } from '../../../model/entities/external/stPromotionMaintainMon';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(StPromotionBenefitDay, 'stats')
    private readonly stPromotionBenefitDayRepository: Repository<StPromotionBenefitDay>,
    @InjectRepository(StPromotionMaintainMon, 'stats')
    private readonly stPromotionMaintainMonRepository: Repository<StPromotionMaintainMon>,
  ) {
  }

  private readonly logger: Logger = new Logger(StatsService.name);

  async findBenefitDataByDate(info) {
    this.logger.log(`findAll() start`);
    const promotionId = info.promotionId.replace(/^$/, '%');
    const startDate = info.startDate;
    const endDate = info.endDate;

    if (!startDate || !endDate) {
      throw new BadRequestException('startDate, endDate must be defined');
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

  async findMaintainDataByDate(info) {
    const { startDate, endDate } = info;
    if (!startDate || !endDate) {
      throw new BadRequestException('start date, end date must be defined');
    }
    const promotionId = info.promotionId.replace(/^$/, '%') || '';
    try {
      const findData = await this.stPromotionMaintainMonRepository
        .createQueryBuilder()
        .select([
          'DATE_FORMAT(stat_time, "%Y-%m-%d") AS statTime', 'promotion_id AS promotionId', 'DATE_FORMAT(start_mon, "%Y-%m") AS startMon',
          'init_count AS initCount', 'current_count AS currentCount',
        ])
        .where('stat_time >= :startDate AND stat_time <= :endDate', { startDate, endDate })
        .andWhere('promotion_id LIKE (:promotionId)', { promotionId })
        .execute();

      let promotionIdGroup = findData.map((v) => v.promotionId);

      const result = await promotionIdGroup.reduce((acc, cur, i) => {
        const form = {
          // title: findData.find((data) => data.promotionId === cur).title,
          title: `연습 프로모션 제목 - ${cur}`,
          promotionId: cur,
          initCount: findData.find((data) => data.promotionId === cur).initCount,
          users: [],
        };
        findData.forEach((data) => {
          if (data.promotionId === cur) {
            form.users.push({ [data.startMon]: [`${((data.currentCount / data.initCount) * 100).toFixed(2)}%`, data.currentCount] });
          }
        });
        acc.push(form);
        return acc;
      }, []);

      return result;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}