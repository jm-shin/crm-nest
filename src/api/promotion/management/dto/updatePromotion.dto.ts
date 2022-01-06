import { IsDefined, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePromotionDto {

  @IsDefined()
  @Type(() => Number)
  readonly idx: number;

  @IsDefined()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly promotionId: string;

  @IsOptional()
  @Type(() => Number)
  readonly groupNo: number;
  
  @IsOptional()
  @Type(() => Number)
  readonly receiverId: number;

  @IsOptional()
  readonly conditionJson: string;
}