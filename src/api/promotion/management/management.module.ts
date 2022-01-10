import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../entities/user.entity';
import { PromotionInfoRepository } from '../../../entities/repository/promotionInfoRepository';
import { ManagementController } from './management.controller';
import { ManagementService } from './management.service';
import { PromotionReceiverInfoRepository } from '../../../entities/repository/promotionReceiverInfoRepository';

@Module({
  imports:[ TypeOrmModule.forFeature([User, PromotionInfoRepository, PromotionReceiverInfoRepository])],
  exports: [TypeOrmModule],
  controllers: [ManagementController],
  providers: [ManagementService],
})
export class ManagementModule {
}
