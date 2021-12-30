import { ReceiverService } from './receiver.service';
import { ReceiverController } from './receiver.controller';
import { PromotionReceiverInfo } from './entities/promotionReceiverInfo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FactorConverter } from '../../../common/utils/factorConverter';
import { User } from '../../user/entities/user.entity';
import { PromotionReceiverInfoRepository } from './repo/promotionReceiverInfoRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PromotionReceiverInfo, User, PromotionReceiverInfoRepository
    ]),
    FactorConverter,
  ],
  exports: [TypeOrmModule, ReceiverService],
  controllers: [ReceiverController],
  providers: [ReceiverService],
})

export class ReceiverModule {
}
