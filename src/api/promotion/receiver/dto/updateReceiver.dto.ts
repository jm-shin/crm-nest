import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateReceiverDto {
  @Type(() => Number)
  @IsDefined()
  @IsNotEmpty()
  readonly idx: number;

  @IsString()
  @ApiProperty({ type: String, description: '제목' })
  readonly title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '설명' })
  readonly description: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, description: '유저 인덱스' })
  readonly userIdx: number;

  @IsString()
  @ApiProperty({ type: String, description: '추출 조건 텍스트' })
  readonly conditionText: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, description: '그룹 번호' })
  readonly groupNo: number;
}