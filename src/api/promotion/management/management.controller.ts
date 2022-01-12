import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Logger,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ManagementService } from './management.service';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { TransformInterceptor } from '../../../common/interceptor/transform.interceptor';
import { UpdatePromotionDto } from './dto/updatePromotion.dto';
import { ReadPromotionDto } from './dto/readPromotion.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../../common/utils/multerOptions';

@Controller('api/promotion/management')
export class ManagementController {
  constructor(
    private readonly managementService: ManagementService,
  ) {
  }

  private readonly logger = new Logger(ManagementController.name);

  @ApiResponse({ description: '프로모션 등록' })
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'android_layerpopup_image', maxCount: 1 },
    { name: 'android_lnbtoptext_image', maxCount: 1 },
    { name: 'android_lnbtopbutton_image', maxCount: 1 },
    { name: 'android_homeband_image', maxCount: 1 },
    { name: 'android_voucher_index_image', maxCount: 1 },
    //ios
    { name: 'ios_layerpopup_image', maxCount: 1 },
    { name: 'ios_lnbtoptext_image', maxCount: 1 },
    { name: 'ios_lnbtopbutton_image', maxCount: 1 },
    { name: 'ios_homeband_image', maxCount: 1 },
    { name: 'ios_voucher_index_image', maxCount: 1 },
    //pc
    { name: 'pc_layerpopup_image', maxCount: 1 },
    { name: 'pc_lnbtoptext_image', maxCount: 1 },
    { name: 'pc_lnbtopbutton_image', maxCount: 1 },
    { name: 'pc_homeband_image', maxCount: 1 },
    { name: 'pc_voucher_index_image', maxCount: 1 },
    //mobile
    { name: 'mobile_layerpopup_image', maxCount: 1 },
    { name: 'mobile_lnbtoptext_image', maxCount: 1 },
    { name: 'mobile_lnbtopbutton_image', maxCount: 1 },
    { name: 'mobile_homeband_image', maxCount: 1 },
    { name: 'mobile_voucher_index_image', maxCount: 1 },
  ], multerOptions))
  @UseInterceptors(TransformInterceptor)
  // async create(@Body() createData: CreatePromotionDto) {
  async create(@Body() createData, @UploadedFiles() files: Express.Multer.File[]) {
    this.logger.log(`createData: ${JSON.stringify(createData)}`);
    const sendFiles = Object.assign({}, files);
    return this.managementService.save(createData, sendFiles);
  }

  @ApiResponse({ description: '프로모션 상세보기' })
  @Post('bring')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async findOne(@Body('idx', ParseIntPipe) idx: number) {
    return this.managementService.getOne(idx);
  }

  @ApiResponse({ description: '프로모션 리스트 조회' })
  @Post('bring/list')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async findAll(@Body() findOpt: ReadPromotionDto) {
    return this.managementService.getAll(findOpt);
  }

  @ApiResponse({ description: '프로모션 수정' })
  @Put()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransformInterceptor)
  async update(@Body() updateData: UpdatePromotionDto) {
    return this.managementService.update(updateData);
  }

  @ApiResponse({ description: '프로모션 삭제' })
  @Delete()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransformInterceptor)
  async delete(@Body('idx') idx: number[]) {
    return this.managementService.remove(idx);
  }

  //파일업로드 테스트
  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'file', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ], multerOptions))
  uploadImage(@UploadedFiles() files: Express.Multer.File[], @Body('json') json, @Req() request) {
    // const obj = JSON.parse(JSON.stringify(files));
    // console.log(obj);
  }
}