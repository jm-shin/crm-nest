import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('api/promotion/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {
  }

  @Get('benefit')
  getOne() {
    return this.statsService.find();
  }

}
