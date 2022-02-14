import { IsDefined, IsString } from 'class-validator';

export class CreateProductDto {
  @IsDefined()
  @IsString()
  productName: string;

  @IsDefined()
  @IsString()
  productId: string;
}