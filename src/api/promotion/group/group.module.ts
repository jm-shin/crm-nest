import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionReceiverGroupInfoRepository } from '../../../entities/repository/promotionReceiverGroupInfoRepository';
import { User } from '../../../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PromotionReceiverGroupInfoRepository,
      User
    ]),
  ],
  exports:[TypeOrmModule],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
