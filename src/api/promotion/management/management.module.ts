import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../model/entities/user.entity';
import { PromotionInfoRepository } from '../../../model/repository/promotionInfo.repository';
import { ManagementController } from './management.controller';
import { ManagementService } from './management.service';
import { PromotionReceiverInfoRepository } from '../../../model/repository/promotionReceiverInfo.repository';

@Module({
  imports:[ TypeOrmModule.forFeature([User, PromotionInfoRepository, PromotionReceiverInfoRepository])],
  exports: [TypeOrmModule],
  controllers: [ManagementController],
  providers: [ManagementService],
})
export class ManagementModule {
}
