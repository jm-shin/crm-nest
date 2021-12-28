import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Controller, Get, Inject, Logger, LoggerService, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('')
export class AppController {
  constructor(
    // @Inject(WINSTON_MODULE_NEST_PROVIDER)
    // private readonly logger: LoggerService,
    private readonly appService: AppService,
    private authService: AuthService,
  ) {
  }

  private readonly logger = new Logger(AppController.name);

  @Get()
  getHello(): string {
    this.logger.log('Calling getHello()');
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    this.logger.log(req.user);
    return req.user;
  }
}