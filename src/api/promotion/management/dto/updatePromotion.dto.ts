import { PartialType } from '@nestjs/mapped-types';
import { CreatePromotionDto } from './createPromotion.dto';

export class UpdatePromotionDto extends PartialType(CreatePromotionDto){}