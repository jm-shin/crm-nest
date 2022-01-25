import { Body, Controller, HttpCode, InternalServerErrorException, Logger, Post, Res, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiOperation } from '@nestjs/swagger';
import contentDisposition from 'content-disposition';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('api/promotion/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {
  }

  private logger = new Logger(StatsController.name);

  @ApiOperation({
    summary: '프로모션 혜택 회원 조회',
    description: 'benefit 통계',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('benefit')
  getStatsBenefit(@Body() body) {
    return this.statsService.findBenefitDataByDate(body);
  }

  @ApiOperation({
    summary: 'benefit 통계 다운로드',
    description: '통계 csv 파일로 다운로드',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('benefit/download')
  async downloadBenefitStat(@Body() body, @Res() res) {
    try {
      const csv = await this.statsService.getBenefitStatDownload();
      const fileName = `프로모션 혜택 회원 조회.csv`;
      res.type('text/csv');
      res.set('Content-Disposition', contentDisposition(fileName));
      res.write(csv);
      res.end();
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException();
    }
  }

  @ApiOperation({
    summary: '프로모션 잔존율 조회',
    description: '프로모션 잔존율 조회',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('maintain')
  async getStatsMaintain(@Body() body) {
    return await this.statsService.findMaintainDataByDate(body);
  }
}
