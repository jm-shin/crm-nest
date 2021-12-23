import { UpdateReceiverDto } from './dto/updateReceiver.dto';
import { CreateReceiverDto } from './dto/createReceiver.dto';
import { Injectable, Logger } from '@nestjs/common';
import { PromotionReceiverInfo } from './entities/promotion_receiver_info.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import * as moment from 'moment';
import { User } from '../user/entities/user.entity';


@Injectable()
export class PromotionService {
    constructor(
        @InjectRepository(PromotionReceiverInfo)
        private promotionReceiverInfoRepository: Repository<PromotionReceiverInfo>,
    ) { }

    private readonly logger = new Logger(PromotionService.name);

    async getAll(): Promise<PromotionReceiverInfo[]> {
        try {
            const promotionInfoList = await this.promotionReceiverInfoRepository.find({ relations:['User'] });
            // const promotionInfoList = await getRepository(PromotionReceiverInfo)
            //   .createQueryBuilder('receiver')
            //   .innerJoin('receiver.User', 'user').getMany();
            this.logger.log(`getAll() result: ${JSON.stringify(promotionInfoList)}`);
            return promotionInfoList;
        } catch (error) {
            this.logger.error(error);
        }
    }

    async getOne(id: number): Promise<PromotionReceiverInfo> {
        try {
            const receiver = await this.promotionReceiverInfoRepository.findOne({
                where: {receiverId: id},
                relations: ['User']
            });
            // const receiver = await getRepository(PromotionReceiverInfo)
            //   .createQueryBuilder('receiverInfo')
            //   .leftJoinAndSelect('receiverInfo.User', 'User')
            //   .where('receiverInfo.receiverId = :id', {id})
            //   .getOne();
            return receiver;
        } catch (error) {
            this.logger.error(error);
        }
    }

    async save(receiverData: CreateReceiverDto) {
        // const { title, description, userIdx, groupNo, conditionText, conditionJson, validState } = receiverData;
        // const createReceiverData = {
        //     title,
        //     description,
        //     user_idx: userIdx,
        //     group_no: groupNo,
        //     condition_text: conditionText,
        //     condition_json: conditionJson,
        //     valid_state: validState,
        // }
        this.logger.log(`createReceiverData: ${JSON.stringify(receiverData)}`);
        try {
            await this.promotionReceiverInfoRepository.save(receiverData);
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
            valid_state: validState ? validState : null,
            updated_at: moment().format(),
        }
        this.logger.log( `updateReceiverData ${JSON.stringify(updateReceiverData)}`);
        try {
            await this.promotionReceiverInfoRepository.update({ receiverId: receiverId }, updateReceiverData);
        } catch (error) {
            this.logger.error(error);
        }
    }

    async deleteOne(receiverId: number): Promise<void> {
        try {
            await this.promotionReceiverInfoRepository.delete({ receiverId: receiverId });
        } catch (error) {
            this.logger.error(error);
        }
    }
}
