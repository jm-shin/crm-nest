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
import { ApiOperation } from '@nestjs/swagger';
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

  @ApiOperation({ summary: '프로모션관리 등록', description: '프로모션 관리에서 프로모션을 추가한다.' })
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

  @ApiOperation({ summary: '프로모션관리 상세보기', description: '프로모션 정보 하나를 상세보기한다.' })
  @Post('bring')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async findOne(@Body('idx', ParseIntPipe) idx: number) {
    return this.managementService.getOne(idx);
  }

  @ApiOperation({ summary: '프로모션관리 리스트 조회', description: '프로모션 리스트를 조회한다.' })
  @Post('bring/list')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async findAll(@Body() findOpt: ReadPromotionDto) {
    return this.managementService.getAll(findOpt);
  }

  @ApiOperation({ summary: '프로모션관리 수정', description: '프로모션 정보를 수정한다' })
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

  @ApiOperation({ summary: '프로모션관리 삭제', description: '프로모션 정보를 삭제한다.(복수 허용)' })
  @Delete()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransformInterceptor)
  async delete(@Body('idx') idx: number[]) {
    return this.managementService.remove(idx);
  }

  @ApiOperation({ summary: '프로모션 최종 JSON 조건 프리뷰', description: '프로모션 조건 최종 JSON 형식 미리보기한다.' })
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