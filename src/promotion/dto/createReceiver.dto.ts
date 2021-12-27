import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReceiverDto {
    @IsString()
    @ApiProperty({type: String, description: '제목'})
    readonly title: string;

    @IsOptional()
    @IsString()
    @ApiProperty({type: String, description: '설명'})
    readonly description: string;

    @IsNumber()
    @ApiProperty({type: Number, description: '유저 인덱스'})
    readonly userIdx: number;

    @IsNumber()
    @ApiProperty({type: Number, description: '그룹 번호'})
    readonly groupNo: number;

    @IsString()
    @ApiProperty({type: String, description: '추출 조건 텍스트'})
    readonly conditionText: string;

    @IsOptional()
    @IsString()
    readonly conditionJson: string;

    @IsNumber()
    @ApiProperty({type: Number, description: '유효'})
    readonly validState: number;

    @IsOptional()
    @IsDate()
    readonly createdAt: Date;

    @IsOptional()
    @IsDate()
    readonly updatedAt: Date;
}