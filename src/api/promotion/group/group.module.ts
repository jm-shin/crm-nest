import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionReceiverGroupInfoRepository } from './repo/promotionReceiverGroupInfoRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PromotionReceiverGroupInfoRepository
    ]),
  ],
  exports:[TypeOrmModule],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
