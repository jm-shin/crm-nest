import { IsNumber, IsString } from 'class-validator';

export class ReadGroupDto {
  @IsString()
  readonly title: string;

  @IsNumber()
  readonly unoCount: number;

  @IsNumber()
  readonly groupNo: number;

  @IsString()
  readonly registrant: string;

  @IsString()
  readonly updateAt: string;
}