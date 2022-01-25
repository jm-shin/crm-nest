import { Body, Controller, HttpCode, InternalServerErrorException, Logger, Post, Res } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiOperation } from '@nestjs/swagger';
import contentDisposition from 'content-disposition';

@Controller('api/promotion/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {
  }

  private logger = new Logger(StatsController.name);

  @ApiOperation({ summary: 'benefit 통계' })
  @HttpCode(200)
  @Post('benefit')
  getAll(@Body() body) {
    return this.statsService.findAll(body);
  }

  @ApiOperation({ summary: 'benefit 통계 다운로드', description: '통계 csv 파일로 다운로드' })
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

}
