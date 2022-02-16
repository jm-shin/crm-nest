import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { StPromotionBenefitDay } from '../../../model/entities/external/stPromotionBenefitDay.entity';
import { getManager, Repository } from 'typeorm';
import { parse } from 'json2csv';
import { StPromotionMaintainMonEntity } from '../../../model/entities/external/stPromotionMaintainMon.entity';
import { StSubscPerProductDayEntity } from '../../../model/entities/external/stSubscPerProductDay.entity';
import { ProductInfoEntity } from '../../../model/entities/productInfo.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(StPromotionBenefitDay, 'stats')
    private readonly stPromotionBenefitDayRepository: Repository<StPromotionBenefitDay>,
    @InjectRepository(StPromotionMaintainMonEntity, 'stats')
    private readonly stPromotionMaintainMonRepository: Repository<StPromotionMaintainMonEntity>,
    @InjectRepository(StSubscPerProductDayEntity, 'stats')
    private readonly stStSubscPerProductDayRepository: Repository<StSubscPerProductDayEntity>,
    @InjectRepository(ProductInfoEntity)
    private readonly productInfoRepository: Repository<ProductInfoEntity>,
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
        .where('stat_time >= :startDate AND stat_time <= :endDate', { startDate, endDate })
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
      /*
      const fields = ['title', 'promotionId', 'lastCount', 'currentCount', 'benefitCount'];
      const opts = { fields };
      const myData = await this.stPromotionBenefitDayRepository.find();
      const csv = parse(myData, opts);
      return csv;
       */
      const fields = ['title', 'promotionId', 'currentCount', 'lastCount', 'benefitCount'];
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
    // const { startDate, endDate } = info;
    const startDate = `${info.startDate}-01`;
    const endDate = `${info.endDate}-31`;

    if (!startDate || !endDate) {
      throw new BadRequestException('start date, end date must be defined');
    }
    const promotionId = info.promotionId.replace(/^$/, '%') || '';
    try {
      const findData = await this.stPromotionMaintainMonRepository
        .createQueryBuilder()
        .select([
          'DATE_FORMAT(stat_time, "%Y-%m") AS statTime', 'promotion_id AS promotionId', 'DATE_FORMAT(start_mon, "%Y-%m") AS startMon',
          'init_count AS initCount', 'current_count AS currentCount',
        ])
        .where('stat_time >= :startDate AND stat_time <= :endDate', { startDate, endDate })
        .andWhere('promotion_id LIKE (:promotionId)', { promotionId })
        .execute();

      let promotionIdGroup = findData.map((v) => v.promotionId);
      const targetPromotionId = [...new Set(promotionIdGroup)] as any;

      const result = await targetPromotionId.reduce((acc, cur) => {
        const form = {
          // title: findData.find((data) => data.promotionId === cur).title,
          title: `${cur} 프로모션`,
          promotionId: cur,
          startMon: findData.find((data) => data.promotionId === cur).startMon,
          users: [],
        };
        findData.forEach((data) => {
          if (data.promotionId === cur) {
            form.users.push({
              [data.statTime]: [`${((data.currentCount / data.initCount) * 100).toFixed(2)}%`,
                data.currentCount],
            });
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

  async getMaintainDownloadData(info) {
    this.logger.log('getMaintainDownloadData()');
    try {
      const fields = ['promotionId', 'startMon', 'initCount', 'currentCount'];
      const opts = { fields };
      const myData = await this.stPromotionMaintainMonRepository.find();
      console.log(myData);
      const csv = parse(myData, opts);
      return csv;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getProductPurchaseStats(info) {
    this.logger.log('getProductPurchaseStats() start');
    try {
      const { startDate, endDate } = info;
      const findData = await this.stStSubscPerProductDayRepository
        .createQueryBuilder('purchase')
        // .leftJoin('purchase.ProductInfo', 'product')
        .select([
          'DATE_FORMAT(purchase.stat_time, "%Y-%m-%d") AS statTime', 'purchase.product_group_id AS groupId',
          'purchase.total_count AS totalCount', 'purchase.new_count AS newCount',
          'purchase.leave_count AS leaveCount',
        ])
        .where('stat_time >= :startDate AND stat_time <= :endDate', { startDate, endDate })
        .execute();

      const allGroupId = findData.map(data => data.groupId);
      const targetPromotionGroupId = [...new Set(allGroupId)];

      let result = [];
      targetPromotionGroupId.forEach((id) => {
        const form = {
          // title: findData.find((data) => data.groupId === id).productName,
          title: 'Basic',
          // groupId: id,
          users: [],
        };
        findData.forEach((data) => {
          if (data.groupId === id) {
            form.users.push({ [data.statTime]: [parseInt(data.totalCount), parseInt(data.newCount), parseInt(data.leaveCount)] });
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

  async saveProductInfo(info) {
    this.logger.log('registerProductInfo()');
    try {
      this.logger.log(`register product info: ${JSON.stringify(info)}`);
      return await this.productInfoRepository.save(info);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async updateProductInfo(info) {
    const { idx, ...updateData } = info;
    try {
      this.logger.log(`idx: ${idx}, update data: ${JSON.stringify(updateData)}`);
      return await this.productInfoRepository.update(idx, updateData);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteProductInfo(idx) {
    this.logger.log('delete product info()');
    try {
      this.logger.log(`idx: ${idx}`);
      return await this.productInfoRepository.delete(idx);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getProductInfoList() {
    this.logger.log('getProductInfoList()');
    try {
      const productInfoList = await this.productInfoRepository
        .createQueryBuilder()
        .select(['idx', 'product_name AS productName', 'product_id AS productId'])
        .execute();
      this.logger.log(`${JSON.stringify(productInfoList)}`);
      return productInfoList ? productInfoList : [];
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  //test
  async queryRunnerTest() {
    //raw query
    const entityManger = await getManager('stats');
    const rawData = await entityManger.query(`select * from product_info`);
    console.log(rawData);
    return rawData;
  }
}