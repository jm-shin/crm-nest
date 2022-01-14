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
    return this.statsService.find();
  }

}
