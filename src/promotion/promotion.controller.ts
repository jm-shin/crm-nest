import { UpdateReceiverDto } from './dto/updateReceiver.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { PromotionService } from './promotion.service';
import {
    Controller,
    Post,
    Body,
    Logger,
    Delete,
    UseGuards,
    Put,
    BadRequestException, HttpCode, Req,
} from '@nestjs/common';
import { CreateReceiverDto } from './dto/createReceiver.dto';
import { PromotionReceiverInfo } from './entities/promotionReceiverInfo.entity';
import { ApiResponse } from '@nestjs/swagger';
import { ReadReceiverDto } from './dto/readReceiver.dto';
import { Request } from 'express';

@Controller('api/promotion')
export class PromotionController {
    constructor(
        private readonly promotionService: PromotionService,
    ) { }

    private logger = new Logger(PromotionController.name);

    //receiver api
    @ApiResponse({ description: '프로모션 대상자 등록' })
    @UseGuards(JwtAuthGuard)
    @Post('/receiver')
    @HttpCode(200)
    create(@Body() receiverData: CreateReceiverDto, @Req() req: Request) {
        this.logger.log(`receiverData: ${JSON.stringify(receiverData)}`);
        return this.promotionService.save(receiverData, req.user['id']);
    }

    @ApiResponse({ description: '프로모션 대상자 리스트 조회' })
    @UseGuards(JwtAuthGuard)
    @Post('/receiver/bring/list')
    @HttpCode(200)
    getAll(@Body() searchInfo: ReadReceiverDto): Promise<PromotionReceiverInfo[]> {
        return this.promotionService.getAll(searchInfo);
    }

    @ApiResponse({ description: '프로모션 대상자 조회' })
    @UseGuards(JwtAuthGuard)
    @Post('/receiver/bring')
    @HttpCode(200)
    getOne(@Body('idx') receiverId: number) {
        return this.promotionService.getOne(receiverId);
    }

    @ApiResponse({ description: '프로모션 대상자 수정' })
    @UseGuards(JwtAuthGuard)
    @Put('/receiver')
    patch(@Body('idx') receiverId: number, @Body() updateData: UpdateReceiverDto, @Req() req: Request) {
        this.logger.log(`updateData: ${JSON.stringify(updateData)}`);
        return this.promotionService.update(receiverId, updateData, req.user['id']);
    }

    @ApiResponse({ description: '프로모션 대상자 삭제' })
    @UseGuards(JwtAuthGuard)
    @Delete('/receiver')
    remove(@Body('idx') receiverId: number[]) {
        return this.promotionService.delete(receiverId);
    }

    @ApiResponse({ description: '대상자 조건 JSON 형식 미리보기' })
    @UseGuards(JwtAuthGuard)
    @Post('/receiver/preview')
    @HttpCode(200)
    getJsonConvPreview(@Body() body: { conditionText: string }) {
        this.logger.log(`conditionText : ${body.conditionText}`);
        if (body.conditionText) {
             return this.promotionService.conditionPreview(body.conditionText);
        } else {
            return new BadRequestException('check conditionText');
        }
    }
}
