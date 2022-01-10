import { IsDefined, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePromotionDto {
  @IsDefined()
  @IsString()
  readonly promotionId: string;

  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsDefined()
  @Type(() => Number)
  readonly receiverId: number;

  @IsDefined()
  @Type(() => Number)
  readonly groupNo: number;
  
  @IsString()
  conditionJson: string;

  @IsDefined()
  actions: string;
}