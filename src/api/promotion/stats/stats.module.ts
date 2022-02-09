import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { StPromotionBenefitDay } from '../../../model/entities/external/stPromotionBenefitDay.entity';
import { StPromotionMaintainMonEntity } from '../../../model/entities/external/stPromotionMaintainMon.entity';
import { StSubscPerProductDayEntity } from '../../../model/entities/external/stSubscPerProductDay.entity';
import { ProductInfoEntity } from '../../../model/entities/productInfo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductInfoEntity
    ]),
    TypeOrmModule.forFeature([
      StPromotionBenefitDay,
      StPromotionMaintainMonEntity,
      StSubscPerProductDayEntity,
    ], 'stats'),
  ],
  exports: [TypeOrmModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {
}
