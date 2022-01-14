import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api/promotion/system/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  private logger = new Logger(UserController.name);

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'CRM2.0 유저 리스트', description: 'CRM 2.0 시스템 유저 리스트를 불러온다.' })
  getAll() {
    this.logger.log('user list getAll()');
    return this.userService.findAll();
  }
}
