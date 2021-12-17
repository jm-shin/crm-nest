import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { PromotionService } from './promotion.service';
import { Controller, Post, Body, Logger, Delete, Param, UseGuards } from '@nestjs/common';
import { CreateReceiverDto } from './dto/createReceiver.dto';

@Controller('promotion')
export class PromotionController {
    constructor(
        private readonly promotionService: PromotionService,
    ) { }

    private logger = new Logger(PromotionController.name);

    @Post()
    create(@Body() receiverData: CreateReceiverDto) {
        this.logger.log(`receiverData: ${JSON.stringify(receiverData)}`);
        return this.promotionService.save(receiverData);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') receiverId: number) {
        return this.promotionService.deleteOne(receiverId);
    }
}
