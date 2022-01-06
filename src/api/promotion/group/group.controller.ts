import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GroupService } from './group.service';
import { ApiResponse } from '@nestjs/swagger';
import { TransformInterceptor } from '../../../common/interceptor/transform.interceptor';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import moment from 'moment';
import { CreateGroupDto } from './dto/createGroup.dto';
import { ReadGroupDto } from './dto/readGroup.dto';

@Controller('api/promotion/group')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
  ) {
  }

  private readonly logger = new Logger(GroupController.name);

  @ApiResponse({ description: 'UNO 그룹 등록' })
  @UseGuards(JwtAuthGuard)
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  @UseInterceptors(TransformInterceptor)
  async unoCsvFileUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() createData: CreateGroupDto,
    @Req() req: Request,
  ) {
    this.logger.log('uno group unoCsvFileUpload()');
    return await this.groupService.create(file, createData, req.user['id']);
  }

  @ApiResponse({ description: 'UNO 그룹 리스트 조회' })
  @UseGuards(JwtAuthGuard)
  @Post('bring/list')
  @HttpCode(200)
  async getAllGroup(@Body() findOpt: ReadGroupDto) {
    this.logger.log('uno group getAllGroup()');
    return await this.groupService.getAll(findOpt);
  }

  @ApiResponse({ description: 'UNO 그룹 상세보기' })
  @UseGuards(JwtAuthGuard)
  @Post('bring')
  @HttpCode(200)
  async getGroup(@Body('idx') groupId: number) {
    this.logger.log('uno group getGroup()');
    return this.groupService.getOne(groupId);
  }

  @ApiResponse({ description: 'UNO 그룹 삭제' })
  @UseGuards(JwtAuthGuard)
  @Delete('')
  @UseInterceptors(TransformInterceptor)
  async remove(@Body('idx') groupId: number) {
    this.logger.log('uno group remove()');
    return await this.groupService.remove(groupId);
  }

  @ApiResponse({ description: 'uno list csv 다운로드' })
  @UseGuards(JwtAuthGuard)
  @Get('uno/download')
  async download(@Body('idx') groupId: number, @Res() res: Response) {
    this.logger.log('uno group download()');
    try {
      const groupNo = await this.groupService.getOne(groupId).then((info) => info.groupNo);
      const currentDate = moment().format('YYMMDD');
      const uno = await this.groupService.getUnoList(groupId);
      res.type('text/csv');
      res.set('Content-Disposition', `attachment; filename=group${groupNo}_${currentDate}.csv`);
      res.write(uno);
      res.end();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @ApiResponse({ description: 'UNO 그룹 리스트 번호만 조회' })
  @UseGuards(JwtAuthGuard)
  @Get('bring/list/number')
  async getGroupNumList() {
    this.logger.log(`getGroupNumList()`);
    return await this.groupService.getGroupNumList();
  }
}
