import { UpdateReceiverDto } from './dto/updateReceiver.dto';
import { CreateReceiverDto } from './dto/createReceiver.dto';
import { Injectable, Logger } from '@nestjs/common';
import { PromotionReceiverInfo } from './entities/promotion_receiver_info.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PromotionService {
    constructor(
        @InjectRepository(PromotionReceiverInfo)
        private promotionReceiverInfoRepository: Repository<PromotionReceiverInfo>,
    ) { }

    private readonly logger = new Logger(PromotionService.name);

    async getAll(): Promise<PromotionReceiverInfo[]> {
        try {
            return await this.promotionReceiverInfoRepository.find();
        } catch (error) {
            this.logger.error(error);
        }
    }

    async getOne(id: number): Promise<PromotionReceiverInfo> {
        try {
            return await this.promotionReceiverInfoRepository.findOne({ receiver_id: id });
        } catch (error) {
            this.logger.error(error);
        }
    }

    async save(receiverData: CreateReceiverDto) {
        const { title, description, userIdx, groupNo, conditionText, conditionJson, validState } = receiverData;
        const createReceiverData = {
            title,
            description,
            user_idx: userIdx,
            group_no: groupNo,
            condition_text: conditionText,
            condition_json: conditionJson,
            vaild_state: validState,
        }
        this.logger.log(`createReceiverData: ${JSON.stringify(createReceiverData)}`);
        try {
            await this.promotionReceiverInfoRepository.save(createReceiverData);
        } catch (error) {
            this.logger.error(error);
        }
    }

    async update(receiverId: number, updateData: UpdateReceiverDto) {
        //TODO
        const { title, description, userIdx, groupNo, conditionText, conditionJson, validState } = updateData;
        const updateReceiverData = {
            title,
            description,
            user_idx: userIdx ? userIdx : null,
            group_no: groupNo ? groupNo : null,
            condition_text: conditionText ? conditionText : null,
            condition_json: conditionJson ? conditionJson : null,
            vaild_state: validState ? validState : null,
        }
        try {
            this.promotionReceiverInfoRepository.update({ receiver_id: receiverId }, updateReceiverData);
        } catch (error) {
            this.logger.error(error);
        }
    }

    async deleteOne(receiverId: number): Promise<void> {
        try {
            await this.promotionReceiverInfoRepository.delete({ receiver_id: receiverId });
        } catch (error) {
            this.logger.error(error);
        }
    }
}
