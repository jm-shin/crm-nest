import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { StPromotionBenefitDay } from '../../../model/entities/external/stPromotionBenefitDay.entity';
import { StPromotionMaintainMon } from '../../../model/entities/external/stPromotionMaintainMon';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StPromotionBenefitDay,
      StPromotionMaintainMon
    ], 'stats'),
  ],
  exports: [TypeOrmModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {
}
