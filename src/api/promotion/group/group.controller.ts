import {
  Body,
  Controller, Delete, Get, HttpCode,
  Logger,
  Post, Res,
  UploadedFile, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GroupService } from './group.service';
import { ApiResponse } from '@nestjs/swagger';
import { TransformInterceptor } from '../../../common/interceptor/transform.interceptor';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Response } from 'express';

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
  public async unoCsvFileUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() createData,
  ) {
    this.logger.log('uno group unoCsvFileUpload()');
    return await this.groupService.create(file, createData);
  }

  @ApiResponse({ description: 'UNO 그룹 조회' })
  @UseGuards(JwtAuthGuard)
  @Post('bring/list')
  @HttpCode(200)
  async getAllGroup(@Body() info: { title, registrant }) {
    this.logger.log('uno group getAll()');
    return await this.groupService.getAll(info);
  }

  @ApiResponse({ description: 'UNO 그룹 삭제' })
  @UseGuards(JwtAuthGuard)
  @Delete('')
  @UseInterceptors(TransformInterceptor)
  async remove(@Body('idx') groupId: number[]) {
    this.logger.log('uno group remove()');
    return await this.groupService.remove(groupId);
  }

  @ApiResponse({ description: 'uno list csv 다운로드' })
  @UseGuards(JwtAuthGuard)
  @Get('uno/download')
  async download(@Body('idx') groupId: number, @Res() res: Response) {
    this.logger.log('uno group download()');
    try {
      const nowDate = new Date().getMonth() + new Date().getDate();
      const uno = await this.groupService.getUnoList(groupId);
      res.type('text/csv');
      res.set('Content-Disposition', `attachment; filename=idx${groupId}_${nowDate}.csv`);
      res.write(uno);
      res.end();
    } catch (error) {
     this.logger.log(error);
    }
  }
}
