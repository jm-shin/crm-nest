import { UpdateReceiverDto } from './dto/updateReceiver.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { PromotionService } from './promotion.service';
import { Controller, Post, Body, Logger, Delete, Param, UseGuards, Get, Patch, Put } from '@nestjs/common';
import { CreateReceiverDto } from './dto/createReceiver.dto';
import { PromotionReceiverInfo } from './entities/promotionReceiverInfo.entity';

@Controller('api/promotion')
export class PromotionController {
    constructor(
        private readonly promotionService: PromotionService,
    ) { }

    private logger = new Logger(PromotionController.name);


    //receiver api
    @UseGuards(JwtAuthGuard)
    @Get('/receiver')
    getAll(): Promise<PromotionReceiverInfo[]> {
        return this.promotionService.getAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/receiver/:id')
    getOne(@Param('id') receiverId: number) {
        return this.promotionService.getOne(receiverId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/receiver')
    create(@Body() receiverData: CreateReceiverDto) {
        this.logger.log(`receiverData: ${JSON.stringify(receiverData)}`);
        return this.promotionService.save(receiverData);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/receiver/:id')
    patch(@Param('id') receiverId: number, @Body() updateData: UpdateReceiverDto) {
        this.logger.log(`updateData: ${JSON.stringify(updateData)}`);
        return this.promotionService.update(receiverId, updateData);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/receiver/:id')
    remove(@Param('id') receiverId: number) {
        return this.promotionService.deleteOne(receiverId);
    }
}
