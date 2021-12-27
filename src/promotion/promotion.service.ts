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
            // const promotionInfoList = await this.promotionReceiverInfoRepository.find({ relations:['User'] });
            const promotionInfoList = await getRepository(PromotionReceiverInfo)
              .createQueryBuilder('r')
              .leftJoinAndSelect('r.User', 'u')
              .select([
                  'r.receiverId AS receiverId', 'r.title AS title', 'r.description AS description', 'u.userName AS registrant',
                  'r.groupNo AS groupNo', 'r.conditionText AS conditionText', 'r.conditionJson AS conditionJson',
                  'r.validState AS validState', 'date_format(r.updatedAt, "%Y-%m-%d %T") AS updatedAt', 'date_format(r.createdAt, "%Y-%m-%d %T") AS createdAt',
              ])
              .getRawMany();

            this.logger.log(`getAll() result: ${JSON.stringify(promotionInfoList)}`);
            return promotionInfoList;
        } catch (error) {
            this.logger.error(error);
        }
    }

    async getOne(id: number): Promise<PromotionReceiverInfo> {
        try {
            // const receiver = await this.promotionReceiverInfoRepository.findOne({
            //     where: {receiverId: id},
            //     relations: ['User']
            // });

            const receiver = await getRepository(PromotionReceiverInfo)
              .createQueryBuilder('r')
              .leftJoinAndSelect('r.User', 'u')
              .select([
                  'r.receiverId AS receiverId', 'r.title AS title', 'r.description AS description', 'u.userName AS registrant',
                  'r.groupNo AS groupNo', 'r.conditionText AS conditionText', 'r.conditionJson AS conditionJson',
                  'r.validState AS validState', 'date_format(r.updatedAt, "%Y-%m-%d %T") AS updatedAt', 'date_format(r.createdAt, "%Y-%m-%d %T") AS createdAt',
              ])
              .where('r.receiverId = :id', {id})
              .getRawOne();

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
