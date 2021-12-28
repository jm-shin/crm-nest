import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { PromotionReceiverInfo } from './entities/promotionReceiverInfo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FactorConverter } from '../common/utils/factorConverter';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PromotionReceiverInfo, User]),
    FactorConverter,
  ],
  exports: [TypeOrmModule],
  controllers: [PromotionController],
  providers: [PromotionService],
})

export class PromotionModule {}
