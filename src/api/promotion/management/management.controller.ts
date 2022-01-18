import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ManagementService } from './management.service';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TransformInterceptor } from '../../../common/interceptor/transform.interceptor';
import { ReadPromotionDto } from './dto/readPromotion.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../../common/utils/multerOptions';
import { User } from '../../../common/decorators/user.decorator';
import { uploadImageFileList } from '../../../common/utils/uploadImageFileList';
import { CreatePromotionDto } from './dto/createPromotion.dto';
import { UpdatePromotionDto } from './dto/updatePromotion.dto';
import { Readable } from 'stream';
import contentDisposition from 'content-disposition';

@Controller('api/promotion/management')
export class ManagementController {
  constructor(
    private readonly managementService: ManagementService,
  ) {
  }

  private readonly logger = new Logger(ManagementController.name);

  @ApiOperation({ summary: '프로모션관리 등록', description: '프로모션 관리에서 프로모션을 추가한다.' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor(uploadImageFileList, multerOptions))
  @UseInterceptors(TransformInterceptor)
  @HttpCode(200)
  @Post()
  async create(@Body() createData: CreatePromotionDto, @UploadedFiles() files: Express.Multer.File[], @User() user) {
    this.logger.log(createData);
    const uploadedImgFiles = Object.assign({}, files);
    return this.managementService.save(createData, uploadedImgFiles, user.id)
      .then(() => this.logger.log('save done()'));
  }

  @ApiOperation({ summary: '프로모션관리 상세보기', description: '프로모션 정보 하나를 상세보기한다.' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('bring')
  async findOne(@Body('idx', ParseIntPipe) idx: number) {
    return this.managementService.getOne(idx);
  }

  @ApiOperation({ summary: '프로모션관리 리스트 조회', description: '프로모션 리스트를 조회한다.' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('bring/list')
  async findAll(@Body() findOpt: ReadPromotionDto) {
    return this.managementService.getAll(findOpt);
  }

  @ApiOperation({ summary: '프로모션관리 수정', description: '프로모션 정보를 수정한다' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor(uploadImageFileList, multerOptions))
  @UseInterceptors(TransformInterceptor)
  @Put()
  async update(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateData: UpdatePromotionDto,
    @User() user,
  ) {
    const uploadedImgFiles = Object.assign({}, files);
    return this.managementService.update(updateData, uploadedImgFiles, user.id);
  }

  @ApiOperation({ summary: '프로모션관리 삭제', description: '프로모션 정보를 삭제한다.(복수 허용)' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransformInterceptor)
  @Delete()
  async delete(@Body('idx') idx: number[]) {
    return this.managementService.remove(idx);
  }

  @ApiOperation({ summary: '프로모션 최종 JSON 조건 프리뷰', description: '프로모션 조건 최종 JSON 형식 미리보기한다.' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor(uploadImageFileList, multerOptions))
  @HttpCode(200)
  @Post('preview')
  preview(@Body() body, @UploadedFiles() files: Express.Multer.File[]) {
    const uploadedImgFiles = Object.assign({}, files);
    return this.managementService.getPreview(body, uploadedImgFiles);
  }

  @ApiOperation({ summary: '프로모션관리 등록 JSON TYPE', description: '프로모션관리 등록에서 JSON 타입으로 등록한다.' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(TransformInterceptor)
  @HttpCode(200)
  @Post('json')
  createPromotionTypeJSON(@UploadedFile() file: Express.Multer.File, @User() user) {
    return this.managementService.registerJSON(file, user.id);
  }

  @ApiOperation({ summary: '프로모션관리 - JSON 파일 내려받기', description: '최종 JSON 파일을 내려받습니다.' })
  @UseGuards(JwtAuthGuard)
  @Get('json/download')
  async downloadPromotionJsonFile(@Body('idx') idx, @Res() res) {
    try {
      this.logger.log('json download start');
      const json = await this.managementService.getDownloadPromotionJson(idx);
      const result = JSON.stringify(json, null, ' ');
      const fileName = `${json.info.name}.json`;
      //stream
      const readable = new Readable();
      readable.push(result);
      readable.push(null);
      res.set('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', contentDisposition(fileName));
      readable.pipe(res);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  //TODO: json 읽기> stream > 외부 서버 > 배포
  @ApiOperation({ summary: 'JSON 파일 배포', description: '프로모션 실행을 위해 JSON 파일 배포 실행한다.' })
  @HttpCode(200)
  @Post('json/release')
  async releaseJSON(@Body() body) {
    try {
      this.logger.log('promotion release start');
      return { statusCode: 200, message: 'success' };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}