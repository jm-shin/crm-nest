import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { stPromotionBenefitDay } from '../../../entities/external/stPromotionBenefitDay.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([stPromotionBenefitDay], 'stats'),
  ],
  exports: [TypeOrmModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {
}
