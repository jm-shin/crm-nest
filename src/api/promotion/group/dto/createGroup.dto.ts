import { IsDefined, IsNotEmptyObject, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGroupDto {
  @IsDefined()
  @IsString()
  readonly title: string;

  @IsDefined()
  @Type(() => Number) //Number 로 변환
  @IsNumber()
  readonly groupNo: number;
}