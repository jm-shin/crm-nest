import { UpdateReceiverDto } from './dto/updateReceiver.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { PromotionService } from './promotion.service';
import { Controller, Post, Body, Logger, Delete, Param, UseGuards, Get, Patch } from '@nestjs/common';
import { CreateReceiverDto } from './dto/createReceiver.dto';
import { PromotionReceiverInfo } from './entities/promotion_receiver_info.entity';

@Controller('api/promotion')
export class PromotionController {
    constructor(
        private readonly promotionService: PromotionService,
    ) { }

    private logger = new Logger(PromotionController.name);

    @UseGuards(JwtAuthGuard)
    @Get('')
    getAll(): Promise<PromotionReceiverInfo[]> {
        return this.promotionService.getAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getOne(@Param('id') receiverId: number) {
        return this.promotionService.getOne(receiverId);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() receiverData: CreateReceiverDto) {
        this.logger.log(`receiverData: ${JSON.stringify(receiverData)}`);
        return this.promotionService.save(receiverData);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    patch(@Param('id') receiverId: number, @Body() updateData: UpdateReceiverDto) {
        this.logger.log(`updateData: ${JSON.stringify(updateData)}`);
        return this.promotionService.update(receiverId, updateData);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') receiverId: number) {
        return this.promotionService.deleteOne(receiverId);
    }
}
