import { IsDefined, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsDefined()
  productName: string;

  @IsDefined()
  productId: [number];
}