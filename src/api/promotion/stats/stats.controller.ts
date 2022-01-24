import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api/promotion/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {
  }

  @ApiOperation({ summary: 'benefit 통계' })
  @Get('benefit')
  getOne() {
    return this.statsService.findAll();
  }
  
  @ApiOperation({ summary: '통계 다운로드', description:'통계 csv 파일로 다운로드'})
  @Get('download')
  downloadBenefitStat () {
    return this.statsService.getBenefitStatDownload();
    //csv 내려주기
  }

}
