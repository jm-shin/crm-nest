import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReadReceiverDto {
  @IsString()
  @ApiProperty({ type: String, description: '제목' })
  readonly title: string;

  @IsString()
  @ApiProperty({ type: String, description: '작성자' })
  readonly registrant: string;
}