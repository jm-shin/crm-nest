import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReceiverDto {
  @IsString()
  @ApiProperty({ type: String, description: '제목' })
  readonly title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '설명' })
  readonly description: string;

  @IsString()
  @ApiProperty({ type: String, description: '추출 조건 텍스트' })
  readonly conditionText: string;

  /*
  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, description: '유저 인덱스' })
  readonly userIdx: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, description: '그룹 번호' })
  readonly groupNo: number;

  @IsOptional()
  @IsString()
  readonly conditionJson: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({type: Number, description: '유효'})
  readonly validState: number;

  @IsOptional()
  @IsDate()
  readonly createdAt: Date;

  @IsOptional()
  @IsDate()
  readonly updatedAt: Date;
   */
}