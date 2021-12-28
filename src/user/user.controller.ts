import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { ApiResponse } from '@nestjs/swagger';

@Controller('api/promotion/system/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  private logger = new Logger(UserController.name);

  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiResponse({ description: '(특정)시스템 유저 리스트' })
  getAll(): Promise<User[]> {
    this.logger.log('user list getAll()');
    return this.userService.findAll();
  }
}
