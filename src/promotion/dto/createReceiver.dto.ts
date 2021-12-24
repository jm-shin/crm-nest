import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReceiverDto {
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly description: string;

    @IsNumber()
    readonly userIdx: number;

    @IsNumber()
    readonly groupNo: number;

    @IsString()
    readonly conditionText: string;

    @IsOptional()
    @IsString()
    readonly conditionJson: string;

    @IsNumber()
    readonly validState: number;

    @IsOptional()
    @IsDate()
    readonly createdAt: Date;

    @IsOptional()
    @IsDate()
    readonly updatedAt: Date;
}