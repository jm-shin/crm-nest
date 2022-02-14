import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './createProduct.dto';
import { IsDefined, IsNumber } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsDefined()
  @IsNumber()
  idx: number
}