import { UpdateReceiverDto } from './dto/updateReceiver.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
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
import { ApiOperation } from '@nestjs/swagger';
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
  @ApiOperation({ summary: '프로모션 대상자 등록', description: '프로모션 대상자를 등록한다.' })
  @UseInterceptors(TransformInterceptor)
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('')
  create(@Body() receiverData: CreateReceiverDto, @User() user) {
    this.logger.log(`receiverData: ${JSON.stringify(receiverData)}`);
    return this.promotionService.save(receiverData, user.id).catch((error) => {
      this.logger.error(error);
      throw new InternalServerErrorException();
    });
  }

  @ApiOperation({ summary: '프로모션 대상자 리스트', description: '프로모션 대상자 리스트를 조회한다.' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('/bring/list')
  async getAll(@Body() searchInfo: ReadReceiverDto) {
    return await this.promotionService.getAll(searchInfo)
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException();
      });
  }

  @ApiOperation({ summary: '프로모션 대상자 상세보기', description: '프로모션 대상자 하나를 상세 조회한다' })
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

  @ApiOperation({ summary: '프로모션 대상자 수정', description: '프로모션 대상자 하나를 수정한다.' })
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

  @ApiOperation({ summary: '프로모션 대상자 삭제', description: '프로모션 대상자를 삭제한다. 복수 대상 가능함.' })
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

  @ApiOperation({ summary: '프로모션 대상자 JSON 프리뷰',description: '프로모션 대상자 조건을 JSON 형식 미리보기한다.' })
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