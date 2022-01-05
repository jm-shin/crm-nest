import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { PromotionInfoRepository } from './repo/promotionInfoRepository';
import { ManagementController } from './management.controller';
import { ManagementService } from './management.service';

@Module({
  imports:[ TypeOrmModule.forFeature([User, PromotionInfoRepository])],
  exports: [TypeOrmModule],
  controllers: [ManagementController],
  providers: [ManagementService],
})
export class ManagementModule {
}
