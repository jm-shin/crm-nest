import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post, Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GroupService } from './group.service';
import { Response } from 'express';
import { ApiResponse } from '@nestjs/swagger';
import { CreateGroupDto } from './dto/createGroup.dto';

@Controller('api/promotion/group')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
  ) {
  }

  private readonly logger = new Logger(GroupController.name);

  @ApiResponse({ description: 'UNO 그룹 등록' })
  @Post('uno/upload')
  @UseInterceptors(FileInterceptor('file'))
  public async unoCsvFileUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() createData,
    @Res() res: Response,
  ) {
    this.logger.log('uno group create!');
    await this.groupService.create(file, createData).catch((error) => {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    });
    return res.status(200).json({ statusCode: 200, message: 'upload success' });
  }

  @ApiResponse({ description: 'UNO 그룹 조회' })
  @Post('bring/list')
  async getAllGroup(@Res() res: Response, @Body() info: { title, registrant }) {
    this.logger.log('uno group getAll()');
    const groupList = await this.groupService.getAll(info);
    return res.status(200).json({ statusCode: 200, message: 'success', list: groupList });
  }
}
