
import { Controller, Get, Inject, Logger, LoggerService } from '@nestjs/common';
import { AppService } from './app.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller('')
export class AppController {
  constructor(
    private readonly appService: AppService,
    // @Inject(WINSTON_MODULE_NEST_PROVIDER)
    // private readonly logger: LoggerService,
  ) {
  }

  private readonly logger = new Logger(AppController.name);

  @Get()
  getHello(): string {
    this.logger.log('Calling getHello()');
    return this.appService.getHello();
  }
}