import { UpdateReceiverDto } from './dto/updateReceiver.dto';
import { CreateReceiverDto } from './dto/createReceiver.dto';
import { Injectable, Logger } from '@nestjs/common';
import { PromotionReceiverInfo } from './entities/promotionReceiverInfo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import * as moment from 'moment';
import { User } from '../user/entities/user.entity';
import { FactorConverter } from '../common/utils/factorConverter';


@Injectable()
export class PromotionService {
    constructor(
        @InjectRepository(PromotionReceiverInfo)
        private promotionReceiverInfoRepository: Repository<PromotionReceiverInfo>,
    ) { }

    private readonly logger = new Logger(PromotionService.name);
    private factorConverter = new FactorConverter();

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

            this.logger.log(`getOne ${JSON.stringify(receiver)}`);
            return receiver;
        } catch (error) {
            this.logger.error(error);
        }
    }

    async save(receiverData: CreateReceiverDto) {
        this.logger.log(`receiverData: ${JSON.stringify(receiverData)}`);

        const { title, description, userIdx, groupNo, conditionText, validState } = receiverData;
        const conditionJson =  JSON.stringify(await this.factorConverter.makeJsonCondition(conditionText));
        this.logger.log(`conditionJson: ${conditionJson}`);
        const createReceiverData = {
            title,
            description,
            userIdx,
            groupNo,
            conditionText,
            conditionJson,
            validState,
        }
        this.logger.log(`createReceiverData: ${JSON.stringify(createReceiverData)}`);
        try {
            await this.promotionReceiverInfoRepository.save(createReceiverData);
        } catch (error) {
            this.logger.error(error);
        }
    }

    async update(receiverId: number, updateData: UpdateReceiverDto) {
        const { title, description, userIdx, groupNo, conditionText, validState } = updateData;
        const conditionJson = JSON.stringify(await this.factorConverter.makeJsonCondition(conditionText));
        this.logger.log(`conditionJson: ${conditionJson}`);
        const updateReceiverData = {
            title,
            description,
            userIdx,
            groupNo,
            conditionText,
            conditionJson,
            validState,
            updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        this.logger.log( `updateReceiverData ${JSON.stringify(updateReceiverData)}`);
        try {
            await this.promotionReceiverInfoRepository.update({receiverId}, updateReceiverData);
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
