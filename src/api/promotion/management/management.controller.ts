import { Body, Controller, HttpCode, Logger, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ManagementService } from './management.service';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CreatePromotionDto } from './dto/createPromotion.dto';
import { TransformInterceptor } from '../../../common/interceptor/transform.interceptor';

@Controller('api/promotion/management')
export class ManagementController {
  constructor(
    private readonly managementService: ManagementService,
  ) {}

  private readonly logger = new Logger(ManagementController.name);

  @ApiResponse({description: '프로모션 등록'})
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UseInterceptors(TransformInterceptor)
  async create (
    @Body() createData: CreatePromotionDto,
  ) {
    this.logger.log('create()');
    return this.managementService.save(createData);
  }

}
