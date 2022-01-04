import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  // @IsString()
  // readonly title: string;
  //
  // @IsOptional()
  // @IsNumber()
  // readonly groupNo: number;
  //
  // @IsOptional()
  // @IsNumber()
  // readonly userIdx: number;
  //
  // @IsNumber()
  // readonly unoCount: number;
  //
  // @IsOptional()
  // @IsString()
  // readonly unoText: string;

  @IsString()
  readonly title: string;

  @IsOptional()
  @IsNumber()
  readonly groupNo: number;

  @IsOptional()
  @IsNumber()
  readonly userIdx: number;

  @IsNumber()
  readonly unoCount: number;

  @IsOptional()
  @IsString()
  readonly unoText: string;
}