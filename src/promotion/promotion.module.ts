import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { PromotionReceiverInfo } from './entities/promotion_receiver_info.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
    imports: [TypeOrmModule.forFeature([PromotionReceiverInfo])],
    exports: [TypeOrmModule],
    controllers: [PromotionController],
    providers: [PromotionService]
})
export class PromotionModule { }
