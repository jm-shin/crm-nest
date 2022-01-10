import { ReceiverService } from './receiver.service';
import { ReceiverController } from './receiver.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FactorConverter } from '../../../common/utils/factorConverter';
import { User } from '../../../entities/user.entity';
import { PromotionReceiverInfoRepository } from '../../../entities/repository/promotionReceiverInfoRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, PromotionReceiverInfoRepository
    ]),
    FactorConverter,
  ],
  exports: [TypeOrmModule],
  controllers: [ReceiverController],
  providers: [ReceiverService],
})

export class ReceiverModule {
}
