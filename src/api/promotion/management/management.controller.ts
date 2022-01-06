import { Body, Controller, Delete, HttpCode, Logger, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ManagementService } from './management.service';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CreatePromotionDto } from './dto/createPromotion.dto';
import { TransformInterceptor } from '../../../common/interceptor/transform.interceptor';
import { UpdatePromotionDto } from './dto/updatePromotion.dto';
import { ReadPromotionDto } from './dto/readPromotion.dto';

@Controller('api/promotion/management')
export class ManagementController {
  constructor(
    private readonly managementService: ManagementService,
  ) {
  }

  private readonly logger = new Logger(ManagementController.name);

  @ApiResponse({ description: '프로모션 등록' })
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UseInterceptors(TransformInterceptor)
  async create(@Body() createData: CreatePromotionDto) {
    return this.managementService.save(createData);
  }

  @ApiResponse({ description: '프로모션 상세보기' })
  @Post('bring')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async findOne(@Body('idx') idx: number) {
    return this.managementService.getOne(idx);
  }

  @ApiResponse({ description: '프로모션 리스트 조회' })
  @Post('bring/list')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async findAll(@Body() findOpt: ReadPromotionDto) {
    return this.managementService.getAll(findOpt);
  }

  @ApiResponse({ description: '프로모션 수정' })
  @Put()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransformInterceptor)
  async update(@Body() updateData: UpdatePromotionDto) {
    return this.managementService.update(updateData);
  }

  @ApiResponse({ description: '프로모션 삭제' })
  @Delete()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransformInterceptor)
  async delete(@Body('idx') idx: number[]) {
    return this.managementService.remove(idx);
  }
}