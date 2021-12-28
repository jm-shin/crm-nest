import { IsString } from 'class-validator';

export class ReadReceiverDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly registrant: string;
}