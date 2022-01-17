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
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GroupService } from './group.service';
import { ApiOperation } from '@nestjs/swagger';
import { TransformInterceptor } from '../../../common/interceptor/transform.interceptor';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Response } from 'express';
import moment from 'moment';
import { CreateGroupDto } from './dto/createGroup.dto';
import { ReadGroupDto } from './dto/readGroup.dto';
import { User } from '../../../common/decorators/user.decorator';

@Controller('api/promotion/group')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
  ) {
  }

  private readonly logger = new Logger(GroupController.name);

  @ApiOperation({ summary: 'UNO 그룹 등록', description: 'UNO 그룹관리에서 그룹을 등록한다.' })
  @UseGuards(JwtAuthGuard)
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  @UseInterceptors(TransformInterceptor)
  async unoCsvFileUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() createData: CreateGroupDto,
    @User() user,
  ) {
    this.logger.log('uno group unoCsvFileUpload()');
    return await this.groupService.create(file, createData, user.id);
  }

  @ApiOperation({ summary: 'UNO 그룹 리스트 조회', description: 'UNO 그룹을 리스트 조회한다.' })
  @UseGuards(JwtAuthGuard)
  @Post('bring/list')
  @HttpCode(200)
  async getAllGroup(@Body() findOpt: ReadGroupDto) {
    this.logger.log('uno group getAllGroup()');
    return await this.groupService.getAll(findOpt);
  }

  @ApiOperation({ summary: 'UNO 그룹 상세보기', description: 'UNO 그룹 하나를 상세보기한다.' })
  @UseGuards(JwtAuthGuard)
  @Post('bring')
  @HttpCode(200)
  async getGroup(@Body('idx', ParseIntPipe) groupId: number) {
    this.logger.log('uno group getGroup()');
    return this.groupService.getOne(groupId);
  }

  @ApiOperation({ summary: 'UNO 그룹 삭제', description: 'UNO 그룹들을 삭제한다.' })
  @UseGuards(JwtAuthGuard)
  @Delete('')
  @UseInterceptors(TransformInterceptor)
  async remove(@Body('idx') groupId: number[]) {
    this.logger.log('uno group remove()');
    return await this.groupService.remove(groupId);
  }

  @ApiOperation({ summary: 'UNO 그룹 정보 CSV 파일 다운로드', description: 'UNO 정보 리스트를 CSV 형식으로 다운로드한다.' })
  @UseGuards(JwtAuthGuard)
  @Get('uno/download')
  async download(@Body('idx', ParseIntPipe) groupId: number, @Res() res: Response) {
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
      throw new InternalServerErrorException();
    }
  }

  @ApiOperation({ summary: 'UNO 그룹 리스트 번호 조회', description: 'UNO 그룹 리스트 중 번호만 조회한다.' })
  @UseGuards(JwtAuthGuard)
  @Get('bring/list/number')
  async getGroupNumList() {
    this.logger.log(`getGroupNumList()`);
    return await this.groupService.getGroupNumList();
  }
}
