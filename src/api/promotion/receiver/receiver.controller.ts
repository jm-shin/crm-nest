import { UpdateReceiverDto } from './dto/updateReceiver.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ReceiverService } from './receiver.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateReceiverDto } from './dto/createReceiver.dto';
import { ApiResponse } from '@nestjs/swagger';
import { ReadReceiverDto } from './dto/readReceiver.dto';
import { TransformInterceptor } from '../../../common/interceptor/transform.interceptor';
import { User } from '../../../common/decorators/user.decorator';

@Controller('api/promotion/receiver')
export class ReceiverController {
  constructor(
    private readonly promotionService: ReceiverService,
  ) {
  }

  private logger = new Logger(ReceiverController.name);

  //receiver api
  @ApiResponse({ description: '프로모션 대상자 등록' })
  @UseInterceptors(TransformInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('')
  create(@Body() receiverData: CreateReceiverDto, @User() user) {
    this.logger.log(`receiverData: ${JSON.stringify(receiverData)}`);
    return this.promotionService.save(receiverData, user.id).catch((error) => {
      this.logger.error(error);
      throw new InternalServerErrorException();
    });
  }

  @ApiResponse({ description: '프로모션 대상자 리스트 조회' })
  @UseGuards(JwtAuthGuard)
  @Post('/bring/list')
  async getAll(@Body() searchInfo: ReadReceiverDto) {
    return await this.promotionService.getAll(searchInfo)
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException();
      });
  }

  @ApiResponse({ description: '프로모션 대상자 상세 조회' })
  @UseGuards(JwtAuthGuard)
  @Post('/bring')
  @HttpCode(HttpStatus.OK)
  async getOne(@Body('idx', ParseIntPipe) receiverId: number) {
    return await this.promotionService.getOne(receiverId)
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException();
      });
  }

  @ApiResponse({ description: '프로모션 대상자 수정' })
  @UseInterceptors(TransformInterceptor)
  @UseGuards(JwtAuthGuard)
  @Put('')
  async patch(@Body('idx', ParseIntPipe) receiverId: number, @Body() updateData: UpdateReceiverDto, @User() user) {
    this.logger.log(`updateData: ${JSON.stringify(updateData)}`);
    return await this.promotionService.update(receiverId, updateData, user.id)
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException();
      });
  }

  @ApiResponse({ description: '프로모션 대상자 삭제' })
  @UseInterceptors(TransformInterceptor)
  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(@Body('idx') receiverId: number[]) {
    return await this.promotionService.delete(receiverId)
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException();
      });
  }

  @ApiResponse({ description: '대상자 조건 JSON 형식 미리보기' })
  @UseGuards(JwtAuthGuard)
  @Post('/preview')
  @HttpCode(200)
  async getJsonConvPreview(@Body() body: { conditionText: string }) {
    if (body.conditionText) {
      return await this.promotionService.conditionPreview(body.conditionText)
        .catch((error) => {
          this.logger.error(error);
          throw new InternalServerErrorException();
        });
    } else {
      return new BadRequestException('check conditionText');
    }
  }
}