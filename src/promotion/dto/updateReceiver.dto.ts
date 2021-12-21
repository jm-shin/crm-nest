import { PartialType } from '@nestjs/mapped-types';
import { CreateReceiverDto } from './createReceiver.dto';

export class UpdateReceiverDto extends PartialType(CreateReceiverDto) { }