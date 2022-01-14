import { IsDefined, IsString } from 'class-validator';

export class ReadPromotionDto {
  @IsDefined()
  @IsString()
  readonly title: string;

  @IsDefined()
  @IsString()
  readonly description: string;

  @IsDefined()
  @IsString()
  readonly registrant: string;

  @IsDefined()
  @IsString()
  readonly promotionId: string;
}