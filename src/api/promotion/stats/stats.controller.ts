import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  Post,
  Put,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiOperation } from '@nestjs/swagger';
import contentDisposition from 'content-disposition';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/createProduct.dto';
import { SuccessMessageInterceptor } from '../../../common/interceptor/success.message.interceptor';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Controller('api/promotion/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {
  }

  private logger = new Logger(StatsController.name);

  @ApiOperation({
    summary: '프로모션 혜택 회원 조회',
    description: 'benefit 통계',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('benefit')
  getStatsBenefit(@Body() body) {
    return this.statsService.findBenefitDataByDate(body);
  }

  @ApiOperation({
    summary: '프로모션 혜택 회원 조회 - 다운로드',
    description: '프로모션 혜택 회원 조회 통계 - csv 파일 다운로드',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('benefit/download')
  async downloadBenefitStat(@Body() body, @Res() res) {
    try {
      const csv = await this.statsService.getBenefitStatDownload();
      const fileName = `프로모션 혜택 회원 조회.csv`;
      res.type('text/csv');
      res.set('Content-Disposition', contentDisposition(fileName));
      res.write(csv);
      res.end();
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException();
    }
  }

  @ApiOperation({
    summary: '프로모션 잔존율 조회',
    description: '프로모션 잔존율 조회',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('maintain')
  async getStatsMaintain(@Body() body) {
    return await this.statsService.findMaintainDataByDate(body);
  }

  @ApiOperation({
    summary: '프로모션 잔존율 다운로드',
    description: '프로모션 잔존율 csv 다운로드',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('maintain/download')
  async maintainStatsDownload(@Body() body, @Res() res) {
    const csv = await this.statsService.getMaintainDownloadData(body);
    const fileName = `프로모션 잔존율 다운로드.csv`;
    res.type('text/csv');
    res.set('Content-Disposition', contentDisposition(fileName));
    res.write(csv);
    res.end();
  }

  @ApiOperation({
    summary: '상품구매추이 통계 검색',
    description: '상품별 누적, 신규, 순증 통계',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('product')
  async getProductPurchaseStats (@Body() body) {
      return this.statsService.getProductPurchaseStats(body);
  }

  //상품관리
  @ApiOperation({
    summary: '상품관리 - 등록',
    description: '상품명, 상품코드 등록'
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UseInterceptors(SuccessMessageInterceptor)
  @Post('product/management')
  registerProductInfo(@Body() info: CreateProductDto){
    return this.statsService.saveProductInfo(info);
  }

  @ApiOperation({
    summary: '상품관리 - 리스트 조회',
    description: '상품 리스트 조회'
  })
  @UseGuards(JwtAuthGuard)
  @Get('product/management')
  getProductInfoList() {
    return this.statsService.getProductInfoList();
  }

  @ApiOperation({
    summary: '상품관리 - 수정',
    description: '상품명, 상품코드 수정'
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SuccessMessageInterceptor)
  @Put('product/management')
  updateProductInfo(@Body() info: UpdateProductDto){
    return this.statsService.updateProductInfo(info);
  }

  @ApiOperation({
    summary: '상품관리 - 삭제',
    description: '상품삭제 - 개별삭제'
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SuccessMessageInterceptor)
  @Delete('product/management')
  removeProductInfo(@Body('idx') idx: number){
    return this.statsService.deleteProductInfo(idx);
  }

  //query test
  @Get('test/query')
  @UseGuards(JwtAuthGuard)
  getQuery() {
    return this.statsService.queryRunnerTest();
  }
}
