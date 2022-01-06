import { IsDefined, IsString } from 'class-validator';

export class ReadGroupDto {
  @IsDefined()
  @IsString()
  readonly title: string;

  @IsDefined()
  @IsString()
  readonly registrant: string;

  @IsDefined()
  readonly groupNo: number;
}