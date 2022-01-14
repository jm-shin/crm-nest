import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Logger,
  ParseIntPipe,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ManagementService } from './management.service';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { TransformInterceptor } from '../../../common/interceptor/transform.interceptor';
import { ReadPromotionDto } from './dto/readPromotion.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../../common/utils/multerOptions';
import { User } from '../../../common/decorators/user.decorator';
import { uploadImageFileList } from '../../../common/utils/uploadImageFileList';

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
  @UseInterceptors(FileFieldsInterceptor(uploadImageFileList, multerOptions))
  @UseInterceptors(TransformInterceptor)
  // async create(@Body() createData: CreatePromotionDto) {
  async create(@Body() createData, @UploadedFiles() files: Express.Multer.File[], @User() user) {
    this.logger.log(createData);
    const uploadedImgFiles = Object.assign({}, files);
    return this.managementService.save(createData, uploadedImgFiles, user.id)
      .then(() => this.logger.log('save done()'));
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
  @UseInterceptors(FileFieldsInterceptor(uploadImageFileList, multerOptions))
  @UseInterceptors(TransformInterceptor)
  async update(
    @UploadedFiles() files: Express.Multer.File[],
    // @Body() updateData: UpdatePromotionDto,
    @Body() updateData,
    @User() user,
  ) {
    const uploadedImgFiles = Object.assign({}, files);
    return this.managementService.update(updateData, uploadedImgFiles, user.id);
  }

  @ApiResponse({ description: '프로모션 삭제' })
  @Delete()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransformInterceptor)
  async delete(@Body('idx') idx: number[]) {
    return this.managementService.remove(idx);
  }

  @ApiResponse({ description: '프로모션 조건 프리뷰 - 최종 JSON' })
  @UseInterceptors(FileFieldsInterceptor(uploadImageFileList, multerOptions))
  @Post('preview')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  preview(@Body() body, @UploadedFiles() files: Express.Multer.File[]) {
    //const data = Object.assign({}, body);
    const uploadedImgFiles = Object.assign({}, files);
    return this.managementService.getPreview(body, uploadedImgFiles);
  }
}