import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';

@Controller('api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  private logger = new Logger(UserController.name);

  @UseGuards(JwtAuthGuard)
  @Get('')
  getAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
