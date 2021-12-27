import { UpdateReceiverDto } from './dto/updateReceiver.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { PromotionService } from './promotion.service';
import {
    Controller,
    Post,
    Body,
    Logger,
    Delete,
    Param,
    UseGuards,
    Get,
    Patch,
    Put,
    BadRequestException, HttpException,
} from '@nestjs/common';
import { CreateReceiverDto } from './dto/createReceiver.dto';
import { PromotionReceiverInfo } from './entities/promotionReceiverInfo.entity';
import { ApiResponse } from '@nestjs/swagger';

@Controller('api/promotion')
export class PromotionController {
    constructor(
        private readonly promotionService: PromotionService,
    ) { }

    private logger = new Logger(PromotionController.name);

    //receiver api
    @UseGuards(JwtAuthGuard)
    @Get('/receiver')
    @ApiResponse({ description: '프로모션 대상자 리스트 조회' })
    getAll(): Promise<PromotionReceiverInfo[]> {
        return this.promotionService.getAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/receiver/:id')
    @ApiResponse({ description: '프로모션 대상자 조회' })
    getOne(@Param('id') receiverId: number) {
        return this.promotionService.getOne(receiverId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/receiver')
    @ApiResponse({ description: '프로모션 대상자 등록' })
    create(@Body() receiverData: CreateReceiverDto) {
        this.logger.log(`receiverData: ${JSON.stringify(receiverData)}`);
        return this.promotionService.save(receiverData);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/receiver/:id')
    @ApiResponse({ description: '프로모션 대상자 수정' })
    patch(@Param('id') receiverId: number, @Body() updateData: UpdateReceiverDto) {
        this.logger.log(`updateData: ${JSON.stringify(updateData)}`);
        return this.promotionService.update(receiverId, updateData);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/receiver/:id')
    @ApiResponse({ description: '프로모션 대상자 삭제' })
    remove(@Param('id') receiverId: number) {
        return this.promotionService.deleteOne(receiverId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/receiver/preview')
    @ApiResponse({ description: 'JSON 형식 미리보기' })
    getJsonConvPreview(@Body() body: { conditionText: string }) {
        this.logger.log(`conditionText : ${body.conditionText}`);
        if (body.conditionText) {
            return this.promotionService.conditionPreview(body.conditionText);
        } else {
            return new BadRequestException('check conditionText');
        }
    }
}
