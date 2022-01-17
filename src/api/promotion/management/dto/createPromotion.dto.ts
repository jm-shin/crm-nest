import { Allow, IsDefined, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Optional } from '@nestjs/common';

export class CreatePromotionDto {
  @IsDefined()
  @IsString()
  readonly id: string;

  @IsDefined()
  @IsString()
  readonly name: string;

  @Optional()
  @IsString()
  readonly description: string;

  @IsDefined()
  @Type(() => Number)
  readonly receiverId: number;

  @IsDefined()
  @IsString()
  readonly action: string;

  @IsDefined()
  @IsString()
  readonly benefit: string;

  @IsDefined()
  @IsString()
  readonly android: string;

  @IsDefined()
  @IsString()
  readonly ios: string;

  @IsDefined()
  @IsString()
  readonly pc: string;

  @IsDefined()
  @IsString()
  readonly mobile: string;

  //image files
  @Allow()
  readonly android_layerpopup_image;

  @Allow()
  readonly android_lnbtoptext_image;

  @Allow()
  readonly android_lnbtopbutton_image;

  @Allow()
  readonly android_homeband_image;

  @Allow()
  readonly android_voucher_index_image;

  @Allow()
  readonly ios_layerpopup_image;

  @Allow()
  readonly ios_lnbtoptext_image;

  @Allow()
  readonly ios_lnbtopbutton_image;

  @Allow()
  readonly ios_homeband_image;

  @Allow()
  readonly ios_voucher_index_image;

  @Allow()
  readonly pc_layerpopup_image;

  @Allow()
  readonly pc_lnbtoptext_image;

  @Allow()
  readonly pc_lnbtopbutton_image;

  @Allow()
  readonly pc_homeband_image;

  @Allow()
  readonly pc_voucher_index_image;

  @Allow()
  readonly mobile_layerpopup_image;

  @Allow()
  readonly mobile_lnbtoptext_image;

  @Allow()
  readonly mobile_lnbtopbutton_image;

  @Allow()
  readonly mobile_homeband_image;

  @Allow()
  readonly mobile_voucher_index_image;
}