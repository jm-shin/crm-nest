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
    BadRequestException,
    HttpCode,
    Req,
    Res,
    HttpStatus,
    InternalServerErrorException,
} from '@nestjs/common';
import { CreateReceiverDto } from './dto/createReceiver.dto';
import { PromotionReceiverInfo } from './entities/promotionReceiverInfo.entity';
import { ApiResponse } from '@nestjs/swagger';
import { ReadReceiverDto } from './dto/readReceiver.dto';
import { Request, Response } from 'express';

@Controller('api/promotion')
export class PromotionController {
    constructor(
        private readonly promotionService: PromotionService,
    ) { }

    private logger = new Logger(PromotionController.name);
    private readonly successMsg = { statusCode: 200, message: 'success'};

    getSuccessMessage(data?) {
        if (!data) {
            return this.successMsg;
        } else if (data && data.length > 1) {
            return { ...this.successMsg, list: data};
        } else if (data && (data.length === undefined || data.length === 1)){
            return { ...this.successMsg, info: data};
        }
    }

    //receiver api
    @ApiResponse({ description: '프로모션 대상자 등록' })
    @UseGuards(JwtAuthGuard)
    @Post('/receiver')
    create(@Body() receiverData: CreateReceiverDto, @Req() req: Request, @Res() res: Response) {
        this.logger.log(`receiverData: ${JSON.stringify(receiverData)}`);
        this.promotionService.save(receiverData, req.user['id']).catch((error) => {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        });
        return res.status(200).json(this.getSuccessMessage());
    }

    @ApiResponse({ description: '프로모션 대상자 리스트 조회' })
    @UseGuards(JwtAuthGuard)
    @Post('/receiver/bring/list')
    async getAll(@Body() searchInfo: ReadReceiverDto, @Res() res: Response) {
        const receiverInfoList = await this.promotionService.getAll(searchInfo)
          .catch((error) => {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        });
        // return res.status(200).json({ ...this.successMsg, list: receiverInfoList});
        return res.status(200).json(this.getSuccessMessage(receiverInfoList));
    }

    @ApiResponse({ description: '프로모션 대상자 상세 조회' })
    @UseGuards(JwtAuthGuard)
    @Post('/receiver/bring')
    @HttpCode(HttpStatus.OK)
    async getOne(@Body('idx') receiverId: number, @Res() res: Response) {
        const receiverInfo = await this.promotionService.getOne(receiverId)
          .catch((error) => {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        });
        return res.status(200).json(this.getSuccessMessage(receiverInfo));
    }

    @ApiResponse({ description: '프로모션 대상자 수정' })
    @UseGuards(JwtAuthGuard)
    @Put('/receiver')
    async patch(@Body('idx') receiverId: number, @Body() updateData: UpdateReceiverDto, @Req() req: Request, @Res() res: Response) {
        this.logger.log(`updateData: ${JSON.stringify(updateData)}`);
        await this.promotionService.update(receiverId, updateData, req.user['id'])
          .catch((error) => {
              this.logger.error(error);
              throw new InternalServerErrorException(error);
          });
        return res.status(200).json(this.getSuccessMessage());
    }

    @ApiResponse({ description: '프로모션 대상자 삭제' })
    @UseGuards(JwtAuthGuard)
    @Delete('/receiver')
    async remove(@Body('idx') receiverId: number[], @Res() res: Response) {
         await this.promotionService.delete(receiverId)
           .catch((error) => {
               this.logger.error(error);
               throw new InternalServerErrorException(error);
           });
         return res.status(200).json(this.getSuccessMessage());
    }

    @ApiResponse({ description: '대상자 조건 JSON 형식 미리보기' })
    @UseGuards(JwtAuthGuard)
    @Post('/receiver/preview')
    @HttpCode(200)
    async getJsonConvPreview(@Body() body: { conditionText: string }, @Res() res: Response) {
        if (body.conditionText) {
            const condition = await this.promotionService.conditionPreview(body.conditionText)
              .catch((error) => {
                  this.logger.error(error);
                  throw new InternalServerErrorException(error);
              });
            return res.status(200).json({...this.successMsg , condition});
        } else {
            return new BadRequestException('check conditionText');
        }
    }
}